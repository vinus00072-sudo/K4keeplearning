# KeepLearning — Original AI Course Restored + Hindi AI Course Added

The original Marathi AI course and its existing live-campaign course ID are preserved. The new Hindi course uses a separate ID so it cannot overwrite the original course.

## Original live Marathi AI course
- Course ID: `b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101`
- Title: **संपूर्ण कृत्रिम बुद्धिमत्ता (AI) कोर्स**
- Sale price: ₹499
- Original price: ₹5,999
- PDF object: `AI Course.pdf`
- Published: true

## New Hindi AI course
- Course ID: `14e5960c-51f4-4e76-ae1a-833d64e25531`
- Title: **AI से पैसे कैसे कमाएँ**
- Sale price: ₹299
- Original price: ₹999
- 40 sections
- 130-page Hindi PDF
- PDF object: `AI_Se_Paise_Kaise_Kamaye_Hindi.pdf`
- Course-specific information/content is shown in Hindi.
- Payment, login/signup, sharing, and other common website actions remain in English.

## Important
- **Complete Software Testing Course stays disabled (`is_published = false`).**
- Keep the `ai-course-pdf` bucket **private**.
- Do not delete either PDF.

## Setup
1. Deploy this updated website ZIP to Vercel.
2. Run `AI-COURSE-SETUP.sql` in Supabase SQL Editor.
3. Confirm both AI courses are published and the Software Testing course is disabled.
4. Confirm both PDF objects exist in the private `ai-course-pdf` bucket.
