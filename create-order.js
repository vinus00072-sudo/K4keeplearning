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

    const courseId = req.body && req.body.courseId;
    if (!courseId) return json(res, 400, { error: 'Course ID is required.' });

    const courseResp = await supabase(`/rest/v1/courses?select=id,title,price,is_published&id=eq.${encodeURIComponent(courseId)}&limit=1`);
    if (!courseResp.ok || !Array.isArray(courseResp.data) || !courseResp.data[0]) {
      return json(res, 404, { error: 'Course not found.' });
    }
    const course = courseResp.data[0];
    if (!course.is_published) return json(res, 400, { error: 'This course is not available for purchase.' });

    const amountRupees = Number(course.price);
    if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
      return json(res, 400, { error: 'Course price is invalid.' });
    }
    const amount = Math.round(amountRupees * 100);
    const receipt = `kl_${String(course.id).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)}_${Date.now()}`.slice(0, 40);

    const razorResp = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: { course_id: String(course.id), user_id: String(user.id) }
      })
    });
    const razorText = await razorResp.text();
    let razorData;
    try { razorData = razorText ? JSON.parse(razorText) : {}; } catch { razorData = {}; }
    if (!razorResp.ok) {
      return json(res, 502, { error: razorData?.error?.description || 'Could not create Razorpay order.' });
    }

    return json(res, 200, {
      orderId: razorData.id,
      amount: razorData.amount,
      currency: razorData.currency,
      keyId: RAZORPAY_KEY_ID,
      courseTitle: course.title,
      customer: { name: user.user_metadata?.full_name || '', email: user.email || '' }
    });
  } catch (e) {
    console.error(e);
    return json(res, 500, { error: 'Unable to start payment right now.' });
  }
};
