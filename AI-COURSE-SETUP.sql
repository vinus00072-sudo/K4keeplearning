-- KeepLearning course restoration + Hindi AI course setup
-- IMPORTANT: the original Marathi AI course uses its existing ID so live campaign links remain valid.
-- The Hindi course gets a NEW ID to prevent overwriting the original course.

alter table public.courses add column if not exists pdf_url text;
alter table public.courses add column if not exists content_language text;

insert into storage.buckets (id, name, public)
values ('ai-course-pdf', 'ai-course-pdf', false)
on conflict (id) do update set public = false;

-- 1) Restore the ORIGINAL live Marathi AI course using its original ID.
update public.courses
set
  title = 'संपूर्ण कृत्रिम बुद्धिमत्ता (AI) कोर्स',
  description = 'कृत्रिम बुद्धिमत्तेची मूलभूत तत्त्वे ते प्रत्यक्ष उपयोगापर्यंत शिका. AI, Generative AI, Prompt Engineering, ChatGPT, AI Tools आणि भविष्यातील करिअरसाठी आवश्यक कौशल्ये सोप्या पद्धतीने शिका. हा कोर्स गृहिणी, विद्यार्थी, नोकरी करणारे कर्मचारी, उद्योजक, छोटे-मोठे व्यवसायिक, फ्रीलांसर, शिक्षक, जॉब शोधणारे आणि प्रोफेशनल्ससाठी उपयुक्त आहे.',
  category = 'कृत्रिम बुद्धिमत्ता (AI)',
  level = 'नवशिक्यांपासून प्रगत स्तरापर्यंत',
  price = 499,
  original_price = 5999,
  rating = 5,
  is_published = true,
  pdf_url = 'AI Course.pdf',
  content_language = 'Marathi'
where id = '6a946d1e-c258-4dfb-95f5-357d7a163c40';

-- 2) The unrelated Software Testing record remains disabled.
update public.courses
set is_published = false
where title = 'Complete Software Testing Course';

-- 3) Create the NEW Hindi course under a different ID.
insert into public.courses (
  id, title, description, price, original_price, thumbnail_url,
  category, level, duration, rating, is_published, pdf_url, content_language
)
values (
  '14e5960c-51f4-4e76-ae1a-833d64e25531',
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
  category = excluded.category,
  level = excluded.level,
  duration = excluded.duration,
  rating = excluded.rating,
  is_published = true,
  pdf_url = excluded.pdf_url,
  content_language = excluded.content_language;

-- Verify the three relevant records.
select id, title, price, original_price, is_published, pdf_url, content_language
from public.courses
where id in (
  '6a946d1e-c258-4dfb-95f5-357d7a163c40',
  '14e5960c-51f4-4e76-ae1a-833d64e25531'
)
order by title;

-- PDF requirements:
-- Keep bucket 'ai-course-pdf' PRIVATE.
-- Upload 'AI Course.pdf' for the original Marathi AI course.
-- Upload 'AI_Se_Paise_Kaise_Kamaye_Hindi.pdf' for the new Hindi course.
