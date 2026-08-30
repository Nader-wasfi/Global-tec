-- ==========================================================================
-- GLOBAL TECH — ADD RATINGS + VIEW TRACKING
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- Safe to run on your live database — only adds new columns (all optional,
-- with safe defaults) and one helper function. Nothing existing is touched.
-- ==========================================================================

-- Manual star rating you set per product from the admin panel (e.g. 4.5, 12 ratings)
alter table public.products
  add column if not exists rating numeric(2,1),
  add column if not exists rating_count integer not null default 0;

-- View tracking, used for the "X people viewed today" line and the
-- "Most Viewed" sort option on the products page.
alter table public.products
  add column if not exists view_count bigint not null default 0,
  add column if not exists views_today integer not null default 0,
  add column if not exists views_today_date date;

-- Called once per product-page visit (see js/services/products-service.js).
-- Bumps the all-time counter, and resets the "today" counter automatically
-- when the date rolls over — no cron job needed.
create or replace function public.increment_product_view(p_id text)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set
    view_count = view_count + 1,
    views_today = case when views_today_date = current_date then views_today + 1 else 1 end,
    views_today_date = current_date
  where id = p_id;
end;
$$;

grant execute on function public.increment_product_view(text) to anon, authenticated;
