/* ==========================================================================
   HOMEPAGE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {

  // ---- hero banner: showcase up to 5 in-stock laptops ----
  const all = await ProductsService.getAll();
  const slides = all.filter(p => p.in_stock).slice(0, 5);
  if (slides.length) initHeroBanner(slides);

  // ---- product rails ----
  ProductsService.getFeatured(4).then(products => renderProductGrid("featuredGrid", products));
  ProductsService.getByCondition("used", 4).then(products => renderProductGrid("usedGrid", products));

  // ---- category strip: brand chips, only for brands that currently have stock ----
  ProductsService.getBrands().then(brands => {
    const strip = document.getElementById("categoryStrip");
    if (!strip || !brands.length) return;
    const chipsHTML = brands.map(b =>
      `<a href="products.html?brand=${encodeURIComponent(b.brand)}" class="category-chip">${escapeHTML(b.brand)}</a>`
    ).join("");
    strip.insertAdjacentHTML("beforeend", chipsHTML);
  });

  // ---- why buy from us ----
  renderTrustGrid();
});

function renderTrustGrid(){
  const grid = document.getElementById("trustGrid");
  if (!grid || typeof SITE_INFO === "undefined") return;

  const cards = [
    {
      icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
      title: "Inspected Before Listing",
      text: "Every laptop is fully checked — hardware, ports, and screen — before it goes up for sale."
    },
    {
      icon: '<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 11v2" stroke-linecap="round"/>',
      title: `Battery Health ${SITE_INFO.batteryHealthMin}%+`,
      text: `We test every battery ourselves — never listed below ${SITE_INFO.batteryHealthMin}% health.`
    },
    {
      icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h.01M7 16h.01M11 8h6M11 16h6"/>',
      title: `Storage Health ${SITE_INFO.storageHealthMin}%+`,
      text: `Drives are tested before listing — never sold below ${SITE_INFO.storageHealthMin}% health.`
    },
    {
      icon: '<path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5z"/>',
      title: `${SITE_INFO.warrantyMonths}-Month Warranty`,
      text: `Every laptop comes with a ${SITE_INFO.warrantyMonths}-month store warranty, no exceptions.`
    }
  ];

  grid.innerHTML = cards.map(c => `
    <div class="trust-card">
      <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${c.icon}</svg></div>
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </div>`).join("");
}

function initHeroBanner(slides){
  const track = document.getElementById("heroBannerTrack");
  const dotsEl = document.getElementById("heroBannerDots");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  const banner = document.getElementById("heroBanner");

  track.innerHTML = slides.map(p => `
    <div class="hero-slide">
      <img src="${p.image_url}" alt="${escapeHTML(p.name)}" onerror="this.src='https://placehold.co/1200x500/151923/5B6272?text=Global+Tec'">
      <div class="hero-slide-scrim"></div>
      <div class="hero-slide-content">
        <span class="hero-slide-brand">${escapeHTML(p.brand)}</span>
        <h2>${escapeHTML(p.name)}</h2>
        <div class="hero-slide-specs">
          <span>${escapeHTML(shortSpec(p.processor || ""))}</span>
          <span>${escapeHTML(p.ram || "")}</span>
          <span>${escapeHTML(p.gpu || "")}</span>
        </div>
        <div class="hero-slide-footer">
          <span class="price hero-slide-price">${formatEGP(p.price)}</span>
          <a href="product-details.html?id=${p.id}" class="btn btn-primary btn-sm">View Details</a>
        </div>
      </div>
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
