# Secure AI Course PDF

## Storage
- Bucket: `ai-course-pdf`
- Bucket must remain PRIVATE.
- Uploaded file: `AI Course.pdf`

## Supabase
Run `AI-COURSE-SECURE-PDF.sql` once. It stores only the object path, not a public URL.

## Website behavior
- Everyone sees the PDF button.
- Before verified enrollment: button is disabled.
- After verified Razorpay payment/enrollment: button becomes enabled.
- Clicking it calls `/api/download-pdf`.
- The server validates the user's Supabase session and matching course enrollment.
- The server creates a short-lived signed URL (120 seconds) from the private bucket.
- The service-role key never reaches the browser.

## Vercel
The existing environment variables must remain:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
