-- Run this once in Supabase SQL Editor after deploying V5.
-- These policies allow your authenticated admin profile to manage
-- course lessons while keeping lessons protected from normal public users.

create policy "Admins can manage lessons"
on public.lessons
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Optional but recommended: allow admins to manage courses too.
create policy "Admins can manage courses"
on public.courses
for all
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
