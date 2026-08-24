/* ==========================================================================
   RENDER PRODUCTS — builds product-card markup and paints it into a grid.
   ========================================================================== */

function productCardHTML(p){
  const compareActive = CompareStore.has(p.id) ? "active" : "";
  const badges = [];
  if (p.condition === "new") badges.push('<span class="badge badge-new">New</span>');
  if (p.condition === "used") badges.push('<span class="badge badge-used">Used</span>');
  if (p.old_price) badges.push('<span class="badge badge-sale">Sale</span>');
  if (!p.in_stock) badges.push('<span class="badge badge-out">Out of stock</span>');

  const specs = [p.processor, p.ram, p.storage].filter(Boolean)
    .map(s => `<span>${escapeHTML(shortSpec(s))}</span>`).join("");

  return `
  <div class="product-card" data-id="${p.id}">
    <a href="product-details.html?id=${p.id}" class="card-media">
      <img src="${p.image_url}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='https://placehold.co/500x375/151923/5B6272?text=Global+Tec'">
      <div class="card-badges">${badges.join("")}</div>
      ${!p.in_stock ? '<div class="card-out-overlay"><span class="badge badge-out">Out of stock</span></div>' : ''}
    </a>
    <button class="card-compare-toggle ${compareActive}" data-compare-id="${p.id}" title="Add to compare" aria-label="Add to compare">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
    </button>
    <div class="card-body">
      <span class="card-brand">${escapeHTML(p.brand)}</span>
      <a href="product-details.html?id=${p.id}" class="card-name">${escapeHTML(p.name)}</a>
      <div class="card-specs">${specs}</div>
      <div class="card-footer">
        <div class="card-price-block">
          <span class="price card-price">${formatEGP(p.price)}</span>
          ${p.old_price ? `<span class="old-price card-oldprice">${formatEGP(p.old_price)}</span>` : ""}
        </div>
        <a href="product-details.html?id=${p.id}" class="card-cta" title="View details">
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
