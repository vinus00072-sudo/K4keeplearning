const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vowlzxhgjyzwzlhdgrnz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'ai-course-pdf';
const SIGNED_URL_TTL = 120; // seconds

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(body));
}

async function sbFetch(path, options = {}) {
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
}

function getObjectPath(value) {
  let raw = String(value || '').trim();
  if (!raw) return '';
  try {
    // Support a stored object path such as "AI Course.pdf".
    if (!/^https?:\/\//i.test(raw)) return raw.replace(/^\/+/, '');

    const u = new URL(raw);
    const marker = `/storage/v1/object/`;
    const i = u.pathname.indexOf(marker);
    if (i >= 0) {
      let rest = u.pathname.slice(i + marker.length);
      rest = rest.replace(/^sign\//, '').replace(/^public\//, '').replace(/^authenticated\//, '');
      const prefix = `${BUCKET}/`;
      if (rest.startsWith(prefix)) rest = rest.slice(prefix.length);
      return decodeURIComponent(rest);
    }
  } catch {}
  return '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!SUPABASE_SERVICE_ROLE_KEY) return json(res, 500, { error: 'Secure PDF service is not configured.' });

  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json(res, 401, { error: 'कृपया आधी लॉगिन करा.' });

    // Validate the actual Supabase access token.
    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!userResp.ok) return json(res, 401, { error: 'तुमचे लॉगिन सत्र वैध नाही.' });
    const user = await userResp.json();

    const courseId = req.body?.courseId;
    if (!courseId) return json(res, 400, { error: 'Course ID आवश्यक आहे.' });

    // Only a verified enrollment unlocks the PDF.
    const enrollmentResp = await sbFetch(
      `/rest/v1/enrollments?select=id&user_id=eq.${encodeURIComponent(user.id)}&course_id=eq.${encodeURIComponent(courseId)}&limit=1`
    );
    if (!enrollmentResp.ok) return json(res, 500, { error: 'Enrollment तपासता आले नाही.' });
    const enrollments = await enrollmentResp.json();
    if (!Array.isArray(enrollments) || !enrollments[0]) {
      return json(res, 403, { error: 'PDF डाउनलोड करण्यासाठी आधी कोर्सची खरेदी पूर्ण करा.' });
    }

    const courseResp = await sbFetch(
      `/rest/v1/courses?select=id,title,pdf_url&id=eq.${encodeURIComponent(courseId)}&limit=1`
    );
    if (!courseResp.ok) return json(res, 500, { error: 'Course माहिती मिळाली नाही.' });
    const courses = await courseResp.json();
    const course = courses?.[0];
    if (!course) return json(res, 404, { error: 'Course सापडला नाही.' });

    const objectPath = getObjectPath(course.pdf_url);
    if (!objectPath) return json(res, 404, { error: 'Course PDF अजून जोडलेला नाही.' });

    // Create a short-lived signed URL from the PRIVATE bucket.
    const signResp = await sbFetch(
      `/storage/v1/object/sign/${encodeURIComponent(BUCKET)}/${objectPath.split('/').map(encodeURIComponent).join('/')}`,
      {
        method: 'POST',
        body: JSON.stringify({ expiresIn: SIGNED_URL_TTL })
      }
    );
    const signText = await signResp.text();
    let signData = {};
    try { signData = signText ? JSON.parse(signText) : {}; } catch {}
    if (!signResp.ok || !signData.signedURL) {
      console.error('Storage signing failed:', signResp.status, signText);
      return json(res, 500, { error: 'PDF link तयार करता आला नाही.' });
    }

    const signedURL = signData.signedURL.startsWith('http')
      ? signData.signedURL
      : `${SUPABASE_URL}/storage/v1${signData.signedURL.startsWith('/') ? '' : '/'}${signData.signedURL}`;

    return json(res, 200, {
      success: true,
      signedUrl: signedURL,
      expiresIn: SIGNED_URL_TTL,
      fileName: objectPath.split('/').pop()
    });
  } catch (e) {
    console.error('Secure PDF error:', e);
    return json(res, 500, { error: 'PDF डाउनलोड करताना तांत्रिक अडचण आली.' });
  }
};
