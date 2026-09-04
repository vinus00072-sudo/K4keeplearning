-- KeepLearning: discount pricing support
-- Run once in Supabase SQL Editor.

alter table public.courses
add column if not exists original_price numeric(12,2);

-- Existing courses: keep their current price as the original price
-- so nothing changes until you enter a discounted selling price.
update public.courses
set original_price = price
where original_price is null;
