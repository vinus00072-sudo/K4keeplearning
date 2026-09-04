# KeepLearning V5 — Course Video System

## Included
- Home page with database-driven published courses
- Pricing plans removed
- Course details page: `course.html?id=COURSE_ID`
- Lesson/module-ready course player
- Admin dashboard can add/edit/delete courses
- Admin dashboard can add/edit/delete video lessons
- Video URL supports YouTube/Vimeo/MP4
- Optional PDF study material URL
- Mobile course-card layout fixed to avoid text clipping
- Supabase connected

## Supabase step
Run `setup-video-policies.sql` once in Supabase SQL Editor. This adds admin policies for course/lesson management.

## Important
The current V5 prepares the course video/player experience. Razorpay payment + server-side payment verification still needs to be connected before taking live payments and automatically creating enrollments.

## Deployment
Use GitHub -> Vercel. Do not keep creating new Vercel projects by ZIP upload.
