-- TEST ONLY: manually unlock one course for one logged-in user.
-- Replace the email and course title, then run in Supabase SQL Editor.
-- Remove/stop using this after Razorpay is connected.

insert into public.enrollments (user_id, course_id, payment_id)
select u.id, c.id, 'TEST_UNLOCK'
from auth.users u
cross join public.courses c
where u.email = 'YOUR-USER-EMAIL'
  and c.title = 'YOUR-COURSE-TITLE'
on conflict (user_id, course_id) do nothing;
