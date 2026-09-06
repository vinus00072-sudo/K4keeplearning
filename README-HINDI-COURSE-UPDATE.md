# KeepLearning — Hindi AI Course Update

This package adds the Hindi course **AI से पैसे कैसे कमाएँ** without changing existing courses/payment behavior.

- Course ID: `b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101`
- Sale price: ₹299
- Original price: ₹999
- 40 sections
- 130-page Hindi PDF
- Course-specific information/content is shown in Hindi.
- Payment, login/signup, sharing, and other common website actions remain in English.
- Existing courses are preserved.

## Setup
1. Run `AI-COURSE-SETUP.sql` in Supabase SQL Editor.
2. In Supabase Storage, keep bucket `ai-course-pdf` **private**.
3. Upload `/mnt/data/AI_Se_Paise_Kaise_Kamaye_Hindi.pdf` as `AI_Se_Paise_Kaise_Kamaye_Hindi.pdf`.
4. Deploy the website files to Vercel.

The PDF is intentionally not included in this ZIP so it is not accidentally exposed as a public Vercel asset. Access is through the authenticated purchase/enrollment check and a short-lived signed URL.
