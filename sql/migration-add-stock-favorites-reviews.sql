-- ==========================================================================
-- GLOBAL TECH — STOCK COUNT, FAVORITE TRACKING, CUSTOMER REVIEWS
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe on your live database — only adds new columns/tables, nothing existing changes.
-- ==========================================================================

-- "Only X left in stock" — leave blank/null on any product to keep the
-- plain "In Stock" label; only fill it in for items you want to show a
-- low-stock count on.
alter table public.products
  add column if not exists stock_quantity integer;

-- Server-side favorite counter (favorites themselves live in each visitor's
-- browser, but this lets the admin Stats tab show "most favorited").
alter table public.products
  add column if not exists favorite_count bigint not null default 0;

create or replace function public.adjust_favorite_count(p_id text, p_delta integer)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set favorite_count = greatest(0, favorite_count + p_delta)
  where id = p_id;
end;
$$;

grant execute on function public.adjust_favorite_count(text, integer) to anon, authenticated;

-- Real customer reviews, submitted from the product page and shown only
-- after you approve them from the admin panel.
create table if not exists public.product_reviews (
  id           text primary key,
  product_id   text not null references public.products(id) on delete cascade,
  customer_name text not null,
  rating       integer not null check (rating between 1 and 5),
  comment      text,
  approved     boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists product_reviews_product_id_idx on public.product_reviews (product_id);

alter table public.product_reviews enable row level security;

drop policy if exists "Public can read approved reviews" on public.product_reviews;
create policy "Public can read approved reviews"
  on public.product_reviews for select
  using (approved = true);

drop policy if exists "Admin can read all reviews" on public.product_reviews;
create policy "Admin can read all reviews"
  on public.product_reviews for select
  to authenticated
  using (true);

drop policy if exists "Anyone can submit a review" on public.product_reviews;
create policy "Anyone can submit a review"
  on public.product_reviews for insert
  to anon, authenticated
  with check (approved = false);

drop policy if exists "Admin can moderate reviews" on public.product_reviews;
create policy "Admin can moderate reviews"
  on public.product_reviews for update
  to authenticated
  using (true);

drop policy if exists "Admin can delete reviews" on public.product_reviews;
create policy "Admin can delete reviews"
  on public.product_reviews for delete
  to authenticated
  using (true);
