const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vowlzxhgjyzwzlhdgrnz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

async function supabase(path, options = {}) {
  const r = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: r.ok, status: r.status, data };
}

function validSignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!SUPABASE_SERVICE_ROLE_KEY || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return json(res, 500, { error: 'Payment server is not configured.' });
  }

  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json(res, 401, { error: 'Please log in first.' });

    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!userResp.ok) return json(res, 401, { error: 'Your login session is invalid or expired.' });
    const user = await userResp.json();

    const {
      courseId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {};
    if (!courseId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json(res, 400, { error: 'Incomplete payment details.' });
    }

    // Retrieve the order from Razorpay so the server, not the browser,
    // determines which order ID is used for signature verification.
    const orderResp = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`
      }
    });
    const orderText = await orderResp.text();
    let order;
    try { order = orderText ? JSON.parse(orderText) : {}; } catch { order = {}; }
    if (!orderResp.ok || !order.id) return json(res, 400, { error: 'Razorpay order could not be verified.' });

    if (String(order.notes?.user_id || '') !== String(user.id) || String(order.notes?.course_id || '') !== String(courseId)) {
      return json(res, 403, { error: 'Payment does not match this user and course.' });
    }

    if (!validSignature(order.id, razorpay_payment_id, razorpay_signature)) {
      return json(res, 400, { error: 'Payment signature verification failed.' });
    }

    const paymentResp = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`
      }
    });
    const paymentText = await paymentResp.text();
    let payment;
    try { payment = paymentText ? JSON.parse(paymentText) : {}; } catch { payment = {}; }
    if (!paymentResp.ok || !payment.id) return json(res, 400, { error: 'Could not verify Razorpay payment status.' });

    if (String(payment.order_id) !== String(order.id)) {
      return json(res, 400, { error: 'Payment is linked to a different order.' });
    }
    if (Number(payment.amount) !== Number(order.amount)) {
      return json(res, 400, { error: 'Payment amount does not match the order.' });
    }
    if (payment.status !== 'captured') {
      return json(res, 400, { error: `Payment is not captured yet (status: ${payment.status || 'unknown'}).` });
    }

    const courseResp = await supabase(`/rest/v1/courses?select=id,title,price&id=eq.${encodeURIComponent(courseId)}&limit=1`);
    if (!courseResp.ok || !courseResp.data?.[0]) return json(res, 404, { error: 'Course not found.' });
    const course = courseResp.data[0];
    const expectedAmount = Math.round(Number(course.price) * 100);
    if (!Number.isFinite(expectedAmount) || expectedAmount !== Number(order.amount)) {
      return json(res, 400, { error: 'Course price changed. Payment was not enrolled.' });
    }

    // Store payment details once. A repeated success callback is safe.
    const existing = await supabase(`/rest/v1/payments?select=id&razorpay_payment_id=eq.${encodeURIComponent(razorpay_payment_id)}&limit=1`);
    if (!existing.ok) return json(res, 500, { error: 'Could not check payment record.' });
    if (!existing.data?.length) {
      const paymentInsert = await supabase('/rest/v1/payments', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({
          user_id: user.id,
          course_id: courseId,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: order.id,
          razorpay_signature: razorpay_signature,
          amount: Number(order.amount) / 100,
          currency: order.currency || 'INR',
          status: payment.status
        })
      });
      if (!paymentInsert.ok) {
        console.error('Payment insert failed:', paymentInsert.data);
        return json(res, 500, { error: 'Payment was verified but could not be recorded. Please contact support before paying again.' });
      }
    }

    const enrollmentResp = await supabase('/rest/v1/enrollments', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        user_id: user.id,
        course_id: courseId,
        payment_id: razorpay_payment_id
      })
    });
    if (!enrollmentResp.ok) {
      console.error('Enrollment insert failed:', enrollmentResp.data);
      return json(res, 500, { error: 'Payment succeeded, but course access could not be activated automatically. Please contact support.' });
    }

    return json(res, 200, {
      success: true,
      message: 'Payment verified. Course unlocked.',
      courseId
    });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: 'Unable to verify payment right now.' });
  }
};
