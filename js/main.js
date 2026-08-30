/* ==========================================================================
   HOMEPAGE CONTROLLER
   ========================================================================== */

/* Static promo banner slides — these are curated marketing posters, not
   auto-generated from product photos. Swap the image files in
   images/banners/ (or edit this array) to change what shows here. */
const HERO_BANNER_SLIDES = [
  { image: "images/banners/banner-power-elegance.jpg", link: "products.html" },
  { image: "images/banners/banner-dell-laptop.jpg", link: "products.html?brand=Dell" },
  { image: "images/banners/banner-workstations.jpg", link: "products.html" }
];

document.addEventListener("DOMContentLoaded", () => {

  // ---- hero banner: static promo posters (not product photos) ----
  initHeroBanner(HERO_BANNER_SLIDES);

  loadHomeContent();
});

function loadHomeContent(){
  // ---- product rails ----
  ProductsService.getFeatured(4).then(products => renderProductGrid("featuredGrid", products));
  ProductsService.getByCondition("used", 4).then(products => renderProductGrid("usedGrid", products));

  // ---- category strip: Dell + HP logo chips first, then Accessories ----
  ProductsService.getBrands().then(brands => {
    const strip = document.getElementById("categoryStrip");
    if (!strip) return;

    const tr = typeof t === "function" ? t : (k => k);
    const BRAND_LOGOS = { hp: "images/brands/hp.png", dell: "images/brands/dell.png" };
    const PRIORITY = ["dell", "hp"]; // Dell, then HP, ahead of any other brand

    const sorted = [...brands].sort((a, b) => {
      const ai = PRIORITY.indexOf(a.brand.toLowerCase());
      const bi = PRIORITY.indexOf(b.brand.toLowerCase());
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.brand.localeCompare(b.brand);
    });

    const brandChipsHTML = sorted.map(b => {
      const logo = BRAND_LOGOS[b.brand.toLowerCase()];
      if (logo){
        return `<a href="products.html?brand=${encodeURIComponent(b.brand)}" class="category-chip has-logo"><img src="${logo}" alt="${escapeHTML(b.brand)}"></a>`;
      }
      return `<a href="products.html?brand=${encodeURIComponent(b.brand)}" class="category-chip">${escapeHTML(b.brand)}</a>`;
    }).join("");

    const accessoriesChipHTML = `<a href="products.html?category=accessory" class="category-chip">${tr("category.accessories")}</a>`;

    // keep only the static "All Laptops" chip, then rebuild the rest
    const allChip = strip.querySelector('[data-i18n="category.all"]');
    strip.innerHTML = "";
    if (allChip) strip.appendChild(allChip);
    strip.insertAdjacentHTML("beforeend", brandChipsHTML + accessoriesChipHTML);
  });

  // ---- why buy from us ----
  renderTrustGrid();
}

function renderTrustGrid(){
  const grid = document.getElementById("trustGrid");
  if (!grid || typeof SITE_INFO === "undefined") return;
  const tr = typeof t === "function" ? t : (k => k);

  const cards = [
    {
      icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
      title: tr("trust.inspected.title"),
      text: tr("trust.inspected.text")
    },
    {
      icon: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2" stroke-linecap="round"/>',
      title: tr("trust.battery.title", {n: SITE_INFO.batteryHealthMin}),
      text: tr("trust.battery.text", {n: SITE_INFO.batteryHealthMin})
    },
    {
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h.01M7 16h.01M11 8h6M11 16h6"/>',
      title: tr("trust.storage.title", {n: SITE_INFO.storageHealthMin}),
      text: tr("trust.storage.text", {n: SITE_INFO.storageHealthMin})
    },
    {
      icon: '<path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5z"/>',
      title: tr("trust.warranty.title", {n: SITE_INFO.warrantyMonths}),
      text: tr("trust.warranty.text", {n: SITE_INFO.warrantyMonths})
    }
  ];

  grid.innerHTML = cards.map(c => `
    <div class="trust-card">
      <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${c.icon}</svg></div>
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </div>`).join("");
}

/* Hero banner now shows static promo posters (see HERO_BANNER_SLIDES above)
   instead of pulling in product photos — each slide is just a clickable image. */
function initHeroBanner(slides){
  const track = document.getElementById("heroBannerTrack");
  const dotsEl = document.getElementById("heroBannerDots");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const banner = document.getElementById("heroBanner");

  track.innerHTML = slides.map(s => `
    <div class="hero-slide">
      <a href="${s.link || 'products.html'}">
        <img src="${s.image}" alt="Global Tech" onerror="this.src='https://placehold.co/1200x500/151923/5B6272?text=Global+Tech'">
      </a>
    </div>`).join("");

  dotsEl.innerHTML = slides.map((_, i) => `<button data-idx="${i}" aria-label="Slide ${i+1}"></button>`).join("");
  const dots = Array.from(dotsEl.children);

  let current = 0;
  let timer = null;

  function goTo(idx){
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function startAutoplay(){
    stopAutoplay();
    if (slides.length > 1) timer = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAutoplay(){ if (timer) clearInterval(timer); }

  prevBtn.addEventListener("click", () => { goTo(current - 1); startAutoplay(); });
  nextBtn.addEventListener("click", () => { goTo(current + 1); startAutoplay(); });
  dots.forEach(d => d.addEventListener("click", () => { goTo(Number(d.dataset.idx)); startAutoplay(); }));
  banner.addEventListener("mouseenter", stopAutoplay);
  banner.addEventListener("mouseleave", startAutoplay);

  if (slides.length <= 1){
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    dotsEl.style.display = "none";
  }

  goTo(0);
  startAutoplay();
}
