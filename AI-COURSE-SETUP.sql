-- KeepLearning Hindi AI Course setup
-- Run once in Supabase SQL Editor. Existing published courses are preserved.

alter table public.courses add column if not exists pdf_url text;
alter table public.courses add column if not exists content_language text;

insert into storage.buckets (id, name, public)
values ('ai-course-pdf', 'ai-course-pdf', false)
on conflict (id) do update set public = false;

insert into public.courses (
  id, title, description, price, original_price, thumbnail_url,
  category, level, duration, rating, is_published, pdf_url, content_language
)
values (
  'b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101',
  'AI से पैसे कैसे कमाएँ',
  'AI का इस्तेमाल करके ऑनलाइन कमाई शुरू करने का 40 सेक्शन वाला प्रैक्टिकल हिंदी कोर्स। सीखें कि AI की मदद से समस्या चुनें, offer बनाएँ, clients तक पहुँचें, service या digital product बेचें और अपनी income को धीरे-धीरे बढ़ाएँ।',
  299,
  999,
  null,
  'AI से कमाई',
  'शुरुआती से उन्नत',
  '40 सेक्शन',
  5,
  true,
  'AI_Se_Paise_Kaise_Kamaye_Hindi.pdf',
  'Hindi'
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
  is_published = true,
  pdf_url = excluded.pdf_url,
  content_language = excluded.content_language;

-- Upload AI_Se_Paise_Kaise_Kamaye_Hindi.pdf to the PRIVATE ai-course-pdf bucket
-- using the exact object name above. Do not make the bucket public.
