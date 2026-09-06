-- KeepLearning: One PDF for the complete AI course
-- Run this ONCE in Supabase SQL Editor.

alter table public.courses
add column if not exists pdf_url text;

-- KeepLearning: Replace the current Software Testing course with an AI course
-- Run this ONCE in Supabase SQL Editor.
--
-- This keeps old payment records for audit/history, but removes public access
-- to the old course. The new AI course is published immediately.

begin;

-- Existing course from the current KeepLearning deployment.
-- Unpublish it first so it cannot appear while related records are cleaned up.
update public.courses
set is_published = false
where id = '6a946d1e-c258-4dfb-95f5-357d7a163c40';

-- Remove lessons and enrollments for the old course.
delete from public.lessons
where course_id = '6a946d1e-c258-4dfb-95f5-357d7a163c40';

delete from public.enrollments
where course_id = '6a946d1e-c258-4dfb-95f5-357d7a163c40';

-- Keep the old course row for payment-history referential integrity.
-- Its is_published=false means it is no longer shown on the website.

-- Create the new AI course with a stable ID so it can be referenced easily.
insert into public.courses (
  id, title, description, price, original_price, thumbnail_url,
  category, level, duration, rating, is_published
)
values (
  'b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101',
  'Complete Artificial Intelligence Course',
  'Learn Artificial Intelligence from fundamentals to practical real-world applications with structured lessons and downloadable study material.',
  499,
  5999,
  null,
  'Artificial Intelligence',
  'Beginner to Advanced',
  '8 Weeks',
  5,
  true,
  null
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price = excluded.price,
  original_price = excluded.original_price,
  thumbnail_url = excluded.thumbnail_url,
  category = excluded.category,
  level = excluded.level,
  duration = excluded.duration,
  rating = excluded.rating,
  is_published = excluded.is_published;

commit;

-- After this, add AI lessons/PDFs from Admin Dashboard.
-- For each lesson:
--   Video URL = your video
--   PDF URL   = your PDF file URL
-- The course page displays the PDF download button only after
-- the user's enrollment/payment has been verified.


-- After running the SQL, use Admin Dashboard:
-- Edit the AI course and paste ONE complete-course PDF URL
-- into "Course PDF URL".
-- Do not add PDFs to individual lessons.
