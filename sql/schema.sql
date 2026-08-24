-- ==========================================================================
-- GLOBAL TEC — SUPABASE SCHEMA
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query
-- ==========================================================================

-- 1) Table -------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  brand         text not null,
  condition     text not null check (condition in ('new', 'used')),
  price         numeric not null,
  old_price     numeric,                 -- nullable, only set when on sale
  processor     text,
  ram           text,
  storage       text,
  gpu           text,
  screen        text,
  description   text,
  image_url     text,                    -- main product image
  image_gallery text[],                  -- optional array of extra image URLs
  in_stock      boolean not null default true,
  created_at    timestamptz not null default now()
);

-- 2) Row Level Security --------------------------------------------------
-- Public storefront: anyone can READ products.
-- Only authenticated/admin users (via the Supabase dashboard or a service key)
-- should be able to INSERT/UPDATE/DELETE — the anon key used in the website
-- only ever performs SELECT queries.
alter table public.products enable row level security;

create policy "Public can read products"
  on public.products
  for select
  using (true);

-- (Optional) if you later add an admin panel that writes with the anon key
-- while logged in via Supabase Auth, add an INSERT/UPDATE policy scoped to
-- an authenticated role here. Until then, add/edit products from the
-- Supabase Table Editor or with the service_role key only.

-- 3) Sample data ----------------------------------------------------------
insert into public.products
  (name, brand, condition, price, old_price, processor, ram, storage, gpu, screen, description, image_url, in_stock)
values
  ('ASUS TUF Gaming A15', 'ASUS', 'new', 40999, 41499,
   'Ryzen 7 8845H (8C/16T)', '8GB DDR5 5600MHz', '512GB SSD M.2', 'RTX 3050 4GB',
   '15.6" IPS FHD 144Hz', 'A reliable gaming laptop with RGB backlit keyboard and strong thermals for the price.',
   'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', true),

  ('Lenovo ThinkPad E14 Gen 6', 'Lenovo', 'new', 42999, null,
   'Intel Core Ultra 5 125U', '8GB DDR5-5600', '512GB SSD PCIe', 'Intel Arc Graphics',
   '14" WUXGA IPS 300nits', 'Business-class durability with a spill-resistant keyboard and long battery life.',
   'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', true),

  ('HP Victus 15', 'HP', 'used', 33999, 38999,
   'Intel Core i7-13620H', '16GB DDR5-4800', '512GB PCIe Gen4', 'RTX 5060 8GB',
   '15.6" FHD 144Hz IPS', 'Lightly used, excellent condition, original charger included. Great value gaming laptop.',
   'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80', true),

  ('MSI Prestige 13 AI Evo', 'MSI', 'new', 47999, null,
   'Intel Core Ultra 7 155H', '16GB LPDDR5 6400MHz', '512GB NVMe Gen4', 'Intel Arc Graphics',
   '13.3" 2.8K OLED 60Hz', 'Ultra-portable creator laptop with a stunning OLED display.',
   'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', true),

  ('Dell Latitude 5420', 'Dell', 'used', 18999, null,
   'Intel Core i5-1135G7', '8GB DDR4', '256GB SSD', 'Intel Iris Xe',
   '14" FHD IPS', 'Well-maintained office laptop, ideal for students and everyday productivity.',
   'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80', true),

  ('ASUS ROG Strix G16', 'ASUS', 'new', 122999, null,
   'Ryzen 9 8940HX (16C/32T)', '16GB DDR5 5200MHz', '1TB SSD Gen4', 'RTX 5070 Ti 12GB',
   '16" IPS WUXGA 165Hz', 'High-end gaming and content-creation powerhouse.',
   'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80', true),

  ('Lenovo Legion 5', 'Lenovo', 'used', 55999, 68499,
   'AMD Ryzen 7 260', '16GB DDR5-5600', '512GB SSD M.2', 'RTX 5050 8GB',
   '15.1" WQXGA OLED 165Hz', 'Barely used, comes with original box and warranty card.',
   'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', true),

  ('Acer Nitro V15', 'Acer', 'new', 54999, 57999,
   'AMD Ryzen 7 170', '16GB DDR5 4800MHz', '512GB NVMe Gen4', 'RTX 5060 8GB',
   '15.6" FHD IPS 165Hz', 'Solid mid-range gaming performance with a clean, understated design.',
   'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80', false);
