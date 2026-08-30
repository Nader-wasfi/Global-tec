/* ==========================================================================
   RENDER PRODUCTS — builds product-card markup and paints it into a grid.
   ========================================================================== */

function productCardHTML(p){
  const compareActive = CompareStore.has(p.id) ? "active" : "";
  const favoriteActive = (typeof FavoritesStore !== "undefined" && FavoritesStore.has(p.id)) ? "active" : "";
  const tr = typeof t === "function" ? t : (k => k);
  const badges = [];
  if (p.condition === "new") badges.push(`<span class="badge badge-new">${tr("badge.new")}</span>`);
  if (p.condition === "used") badges.push(`<span class="badge badge-used">${tr("badge.used")}</span>`);
  if (p.old_price) badges.push(`<span class="badge badge-sale">${tr("badge.save", {n: formatEGP(p.old_price - p.price)})}</span>`);

  const specs = [p.processor, p.ram, p.storage].filter(Boolean)
    .map(s => `<span>${escapeHTML(shortSpec(s))}</span>`).join("");

  return `
  <div class="product-card" data-id="${p.id}">
    <a href="product-details.html?id=${p.id}" class="card-media">
      <img src="${p.image_url}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='https://placehold.co/500x375/151923/5B6272?text=Global+Tec'">
      <div class="card-badges">${badges.join("")}</div>
      ${!p.in_stock ? `<div class="card-out-overlay"><span class="badge badge-out">${tr("badge.out")}</span></div>` : ''}
    </a>
    <div class="card-toggles">
      <button class="card-favorite-toggle ${favoriteActive}" data-favorite-id="${p.id}" title="${tr('card.addFavorite')}" aria-label="${tr('card.addFavorite')}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${favoriteActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
      </button>
      <button class="card-compare-toggle ${compareActive}" data-compare-id="${p.id}" title="${tr('card.addCompare')}" aria-label="${tr('card.addCompare')}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <span class="card-brand">${escapeHTML(p.brand)}</span>
      <a href="product-details.html?id=${p.id}" class="card-name">${escapeHTML(p.name)}</a>
      ${renderStars(p.rating, p.rating_count)}
      <div class="card-specs">${specs}</div>
      <div class="card-stock ${p.in_stock ? '' : 'out'}"><span class="dot"></span>${p.in_stock ? tr('stock.in') : tr('stock.out')}</div>
      <div class="card-footer">
        <div class="card-price-block">
          <span class="price card-price">${formatEGP(p.price)}</span>
          ${p.old_price ? `<span class="old-price card-oldprice">${formatEGP(p.old_price)}</span>` : ""}
        </div>
        <a href="product-details.html?id=${p.id}" class="card-cta" title="${tr('card.viewDetails')}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </div>`;
}

function shortSpec(s){
  return s.length > 22 ? s.slice(0, 20) + "…" : s;
}

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderProductGrid(containerId, products){
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!products.length){
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <h3>No laptops match yet</h3>
      <p>Try widening your filters or clearing the search.</p>
    </div>`;
    return;
  }
  el.innerHTML = products.map(productCardHTML).join("");
  bindCompareToggles(el);
  bindFavoriteToggles(el);
}

function bindCompareToggles(scope){
  scope.querySelectorAll("[data-compare-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-compare-id");
      const result = CompareStore.toggle(id);
      if (result.ok === false && result.reason === "limit"){
        alert(`You can compare up to ${CompareStore.MAX} laptops at a time. Remove one first.`);
        return;
      }
      btn.classList.toggle("active", CompareStore.has(id));
    });
  });
}

function bindFavoriteToggles(scope){
  if (typeof FavoritesStore === "undefined") return;
  scope.querySelectorAll("[data-favorite-id]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-favorite-id");
      FavoritesStore.toggle(id);
      const active = FavoritesStore.has(id);
      btn.classList.toggle("active", active);
      btn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
    });
  });
}
