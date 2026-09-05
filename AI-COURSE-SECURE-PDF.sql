-- Set the private Storage object path for the AI course PDF.
-- Run this once after uploading "AI Course.pdf" to bucket "ai-course-pdf".

update public.courses
set pdf_url = 'AI Course.pdf'
where id = 'b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101';
