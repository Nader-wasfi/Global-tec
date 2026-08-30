-- ==========================================================================
-- GLOBAL TECH — ADD "REVIEWS" TABLE (customer review screenshots)
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- Safe to run on your live database. This does not touch the products
-- table or any existing data — it only adds a new reviews table, reusing
-- the storage bucket you already have (product-images) so no new bucket
-- or storage policy setup is needed.
-- ==========================================================================

create table if not exists public.reviews (
  id          text primary key,
  image_url   text not null,
  sort_order  bigint not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
  on public.reviews
  for select
  using (true);

drop policy if exists "Signed-in users can insert reviews" on public.reviews;
create policy "Signed-in users can insert reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);

drop policy if exists "Signed-in users can delete reviews" on public.reviews;
create policy "Signed-in users can delete reviews"
  on public.reviews
  for delete
  to authenticated
  using (true);
