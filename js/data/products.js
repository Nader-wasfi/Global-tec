/* ==========================================================================
   GLOBAL TEC — PRODUCT CATALOG
   Self-contained data source so the site runs instantly with no backend.
   Structure mirrors sql/schema.sql exactly — swap this file for a real
   Supabase/products-service.js call later without touching any other file.
   ========================================================================== */

const PRODUCTS = [
  {
    id: "p01",
    name: "ASUS TUF Gaming A15",
    brand: "ASUS",
    condition: "used",
    price: 40999,
    old_price: 41499,
    processor: "Ryzen 7 8845H (8C/16T)",
    ram: "8GB DDR5 5600MHz",
    storage: "512GB SSD M.2 NVMe",
    gpu: "RTX 3050 4GB",
    screen: '15.6" IPS FHD 144Hz',
    description: "A reliable gaming laptop with an RGB backlit keyboard and strong thermals for the price. The A15 chassis is MIL-STD-810H tested, so it takes daily commuting and dorm-room life in stride without babying.",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1000&q=80",
      "https://images.unsplash.com/photo-1603481546238-487240415921?w=1000&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p02",
    name: "Lenovo ThinkPad E14 Gen 6",
    brand: "Lenovo",
    condition: "used",
    price: 42999,
    old_price: null,
    processor: "Intel Core Ultra 5 125U",
    ram: "8GB DDR5-5600",
    storage: "512GB SSD PCIe Gen4",
    gpu: "Intel Arc Graphics",
    screen: '14" WUXGA IPS 300nits',
    description: "Business-class durability with a spill-resistant keyboard and long battery life. A sensible daily driver for spreadsheets, video calls, and travel — nothing flashy, everything reliable.",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p03",
    name: "HP Victus 15",
    brand: "HP",
    condition: "used",
    price: 33999,
    old_price: 38999,
    processor: "Intel Core i7-13620H",
    ram: "16GB DDR5-4800",
    storage: "512GB PCIe Gen4 SSD",
    gpu: "RTX 5060 8GB",
    screen: '15.6" FHD 144Hz IPS',
    description: "Lightly used, excellent condition, original charger included. Great value gaming laptop for anyone who wants RTX performance without paying new-unit prices.",
    image_url: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&q=80",
      "https://images.unsplash.com/photo-1550439062-609e1531270e?w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p04",
    name: "MSI Prestige 13 AI Evo",
    brand: "MSI",
    condition: "used",
    price: 47999,
    old_price: null,
    processor: "Intel Core Ultra 7 155H",
    ram: "16GB LPDDR5 6400MHz",
    storage: "512GB NVMe Gen4 SSD",
    gpu: "Intel Arc Graphics",
    screen: '13.3" 2.8K OLED 60Hz',
    description: "Ultra-portable creator laptop with a stunning OLED display. Fits in a small bag, still handles photo editing and light video work without breaking a sweat.",
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
      "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p05",
    name: "Dell Latitude 5420",
    brand: "Dell",
    condition: "used",
    price: 18999,
    old_price: null,
    processor: "Intel Core i5-1135G7",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Intel Iris Xe",
    screen: '14" FHD IPS',
    description: "Well-maintained office laptop, ideal for students and everyday productivity. Light, easy to carry, and priced for tight budgets without cutting corners on build quality.",
    image_url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1000&q=80",
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1000&q=80",
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p06",
    name: "ASUS ROG Strix G16",
    brand: "ASUS",
    condition: "used",
    price: 122999,
    old_price: null,
    processor: "Ryzen 9 8940HX (16C/32T)",
    ram: "16GB DDR5 5200MHz",
    storage: "1TB SSD Gen4",
    gpu: "RTX 5070 Ti 12GB",
    screen: '16" IPS WUXGA 165Hz',
    description: "High-end gaming and content-creation powerhouse. Handles the newest AAA titles at high settings and chews through 4K video exports without slowing down.",
    image_url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1000&q=80",
      "https://images.unsplash.com/photo-1603481546238-487240415921?w=1000&q=80",
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p07",
    name: "Lenovo Legion 5",
    brand: "Lenovo",
    condition: "used",
    price: 55999,
    old_price: 68499,
    processor: "AMD Ryzen 7 260",
    ram: "16GB DDR5-5600",
    storage: "512GB SSD M.2",
    gpu: "RTX 5050 8GB",
    screen: '15.1" WQXGA OLED 165Hz',
    description: "Barely used, comes with the original box and warranty card. The OLED panel alone makes this one of the best deals on the used shelf right now.",
    image_url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80",
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=1000&q=80",
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p08",
    name: "Acer Nitro V15",
    brand: "Acer",
    condition: "used",
    price: 54999,
    old_price: 57999,
    processor: "AMD Ryzen 7 170",
    ram: "16GB DDR5 4800MHz",
    storage: "512GB NVMe Gen4",
    gpu: "RTX 5060 8GB",
    screen: '15.6" FHD IPS 165Hz',
    description: "Solid mid-range gaming performance with a clean, understated design that doesn't scream \"gaming laptop\" in a meeting room.",
    image_url: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1000&q=80",
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1000&q=80"
    ],
    in_stock: false
  },
  {
    id: "p09",
    name: "HP Pavilion Aero 13",
    brand: "HP",
    condition: "used",
    price: 31999,
    old_price: null,
    processor: "AMD Ryzen 5 7530U",
    ram: "16GB LPDDR4x",
    storage: "512GB PCIe SSD",
    gpu: "AMD Radeon Graphics",
    screen: '13.3" WUXGA IPS 400nits',
    description: "Under 1kg and built for people who live out of a backpack. Long battery life covers a full day of lectures or back-to-back client meetings.",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
      "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p10",
    name: "Dell XPS 14",
    brand: "Dell",
    condition: "used",
    price: 89999,
    old_price: 94999,
    processor: "Intel Core Ultra 7 155H",
    ram: "32GB LPDDR5x",
    storage: "1TB NVMe SSD",
    gpu: "NVIDIA RTX 4050 6GB",
    screen: '14.5" 3.2K OLED Touch',
    description: "Premium build in CNC-machined aluminum with an edge-to-edge keyboard. The kind of laptop that looks as good in a portfolio review as it performs.",
    image_url: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1000&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p11",
    name: "MSI Katana 15",
    brand: "MSI",
    condition: "used",
    price: 46999,
    old_price: 52999,
    processor: "Intel Core i7-13620H",
    ram: "16GB DDR5-5200",
    storage: "1TB NVMe SSD",
    gpu: "RTX 4060 8GB",
    screen: '15.6" FHD 144Hz IPS',
    description: "One previous owner, sold with box and invoice. A dependable 1080p gaming rig at a used-market price that undercuts anything comparable that's new.",
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1000&q=80",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1000&q=80",
      "https://images.unsplash.com/photo-1550439062-609e1531270e?w=1000&q=80"
    ],
    in_stock: true
  },
  {
    id: "p12",
    name: "Acer Swift Go 14",
    brand: "Acer",
    condition: "used",
    price: 36999,
    old_price: null,
    processor: "Intel Core Ultra 5 125H",
    ram: "16GB LPDDR5",
    storage: "512GB SSD",
    gpu: "Intel Arc Graphics",
    screen: '14" 2.8K OLED 90Hz',
    description: "A thin, quiet everyday laptop with an OLED screen usually reserved for laptops twice the price. Good for browsing, streaming, and office work in equal measure.",
    image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    image_gallery: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
      "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80"
    ],
    in_stock: true
  },
  // {
  //   id: "p13",
  //   name: "nader",
  //   brand: "Acer",
  //   condition: "new",
  //   price: 36999,
  //   old_price: null,
  //   processor: "Intel Core Ultra 5 125H",
  //   ram: "16GB LPDDR5",
  //   storage: "512GB SSD",
  //   gpu: "Intel Arc Graphics",
  //   screen: '14" 2.8K OLED 90Hz',
  //   description: "A thin, quiet everyday laptop with an OLED screen usually reserved for laptops twice the price. Good for browsing, streaming, and office work in equal measure.",
  //   image_url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
  //   image_gallery: [
  //     "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1000&q=80",
  //     "https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?w=1000&q=80",
  //     "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80"
  //   ],
  //   in_stock: true
  // }
];

/* condition/brand-independent helper used across pages */
function formatEGP(n){
  if (n === null || n === undefined) return "";
  return new Intl.NumberFormat("en-US").format(n) + " EGP";
}
