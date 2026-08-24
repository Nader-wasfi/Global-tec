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
});

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
