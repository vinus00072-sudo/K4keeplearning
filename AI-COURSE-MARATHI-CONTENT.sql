-- KeepLearning: Marathi content for the complete AI course
-- Run once in Supabase SQL Editor.

update public.courses
set
  title = 'संपूर्ण कृत्रिम बुद्धिमत्ता (AI) कोर्स',
  description = 'कृत्रिम बुद्धिमत्तेची मूलभूत तत्त्वे ते प्रत्यक्ष उपयोगापर्यंत शिका. AI, Generative AI, Prompt Engineering, ChatGPT, AI Tools आणि भविष्यातील करिअरसाठी आवश्यक कौशल्ये सोप्या पद्धतीने शिका.',
  category = 'कृत्रिम बुद्धिमत्ता (AI)',
  level = 'नवशिक्यांपासून प्रगत स्तरापर्यंत',
  duration = '8 आठवडे',
  price = 499,
  original_price = 5999,
  rating = 5,
  is_published = true
where id = 'b7d4d1d7-8b7f-4b0e-9b7a-3a8b2d6c4101';
