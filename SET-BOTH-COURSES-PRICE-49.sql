-- KeepLearning: set both currently published courses to ₹49
-- Selling price only; original prices remain unchanged.

UPDATE public.courses
SET price = 49
WHERE is_published = true
  AND title IN (
    'AI से पैसे कैसे कमाएँ',
    'संपूर्ण कृत्रिम बुद्धिमत्ता (AI) कोर्स'
  );

SELECT id, title, original_price, price
FROM public.courses
WHERE is_published = true
  AND title IN (
    'AI से पैसे कैसे कमाएँ',
    'संपूर्ण कृत्रिम बुद्धिमत्ता (AI) कोर्स'
  );
