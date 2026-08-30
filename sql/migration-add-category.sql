-- ==========================================================================
-- GLOBAL TECH — ADD "CATEGORY" COLUMN (for the new Accessories section)
-- Dashboard → SQL Editor → New query → paste this whole file → Run.
--
-- Safe to run on your live database — this does NOT touch schema.sql and
-- does NOT drop or delete anything. It only adds one new column to the
-- existing products table, defaulting every existing row to 'laptop' so
-- nothing you already listed changes or disappears.
-- ==========================================================================

alter table public.products
  add column if not exists category text not null default 'laptop'
  check (category in ('laptop', 'accessory'));

-- Optional: index to keep category filtering fast as your catalog grows.
create index if not exists products_category_idx on public.products (category);
