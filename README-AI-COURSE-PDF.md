# AI Course + Paid PDF Setup

## What changed
- The existing Software Testing course is unpublished by the SQL setup.
- A new published course is created:
  Complete Artificial Intelligence Course
- Price: ₹499
- Original price: ₹5,999
- Discount: 92% (shown by the existing pricing UI)
- The course now has ONE course-level PDF URL.
- After verified payment/enrollment, the course page shows one **⬇ Download Course PDF** button.
- The PDF is not shown as a lesson-by-lesson option.
- Before payment, the course PDF button remains hidden.

## One-time Supabase setup
1. Open Supabase → SQL Editor.
2. Open `AI-COURSE-SETUP.sql`.
3. Run it once.
4. Refresh the KeepLearning website.

## Add AI lessons and PDFs
1. Login as Admin.
2. Open Admin Dashboard.
3. Select **Complete Artificial Intelligence Course**.
4. Add each lesson.
5. Add the video URL.
6. Save the lesson.
7. Edit the AI course and add the single **Course PDF URL**.

## Recommended PDF hosting
Use a Supabase Storage bucket for your course PDFs. For stronger protection, keep the bucket private and use signed URLs/server-side authorization rather than publishing a permanent public PDF URL.

## Paid-access behavior
- Visitor/logged-out user: AI course is visible, but lesson content/PDF is locked.
- Logged-in unpaid user: still locked.
- Successful Razorpay payment + verified enrollment: all lessons become available.
- The PDF button appears only in the unlocked lesson list.
- Clicking **Download PDF** opens the PDF in a new tab and requests download when the browser permits the HTML download attribute.

## Test checklist
1. Open homepage while logged out → AI course is visible.
2. Open AI course → content is locked.
3. Login → content remains locked until paid.
4. Complete Razorpay payment in the configured environment.
5. Verify enrollment → course unlocks.
6. Confirm **Download PDF** appears for lessons with a PDF URL.
7. Click **Download Course PDF** → the single course PDF opens/downloads.
8. Logout → course locks again.
9. Login as another unpaid user → PDF is not shown.
10. Admin adds/edits/deletes lessons → changes appear on course page.
