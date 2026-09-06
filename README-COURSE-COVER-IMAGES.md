# Course Cover Image Update

The two featured course cards now use local, realistic professional learner imagery instead of the generic laptop/chart emoji-style artwork.

- `assets/ai-income-course-cover.jpg` — Hindi AI income course; depicts an Indian woman learner and audience cues for homemakers, employees, students and freelancers.
- `assets/ai-marathi-course-cover.jpg` — Marathi AI course; depicts a diverse Indian learning/professional group, including a woman in traditional attire and male/female learners.

The images are bundled locally in the ZIP and are mapped by the existing course IDs in `script.js` and `course.html`, so no Supabase `thumbnail_url` change is required.

Important: the SQL file in this ZIP uses the currently restored original Marathi AI course ID `6a946d1e-c258-4dfb-95f5-357d7a163c40` and the separate Hindi course ID `14e5960c-51f4-4e76-ae1a-833d64e25531`. Since the live database has already been restored, do not rerun SQL unnecessarily.
