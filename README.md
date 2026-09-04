# KeepLearning V4

Supabase-connected structure:
- Public published courses loaded from `courses`
- Supabase Auth login/signup
- Admin dashboard with course CRUD and publish/unpublish
- Contact number: +91 93702 52572
- Enroll flow prepared for Razorpay

Before deployment:
1. Replace `REPLACE_WITH_YOUR_ANON_KEY` in `script.js` and `admin.html` OR move to a proper build/runtime environment.
2. For production, prefer environment variables rather than committing keys.
3. Add Razorpay server-side order creation and payment signature verification.
4. Tighten Supabase RLS for admin insert/update/delete; do not rely on client-side role checks alone.


### Update
- Removed Basic, Premium, and Pro pricing plans from the website.
- Removed the Pricing navigation link.
