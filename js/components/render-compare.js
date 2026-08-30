/* ==========================================================================
   RENDER COMPARE — builds the side-by-side comparison table.
   ========================================================================== */

function getCompareRows(){
  const tr = typeof t === "function" ? t : (k => k);
  return [
    { key: "price",     label: tr("compare.price"),      fmt: p => formatEGP(p.price) },
    { key: "condition", label: tr("compare.condition"),  fmt: p => p.condition === "new" ? tr("compare.conditionNew") : tr("compare.conditionUsed") },
    { key: "processor", label: tr("compare.processor") },
    { key: "ram",        label: tr("compare.ram") },
    { key: "storage",    label: tr("compare.storage") },
    { key: "gpu",        label: tr("compare.gpu") },
    { key: "screen",     label: tr("compare.display") },
    { key: "in_stock",  label: tr("compare.availability"), fmt: p => p.in_stock ? tr("compare.inStock") : tr("compare.outStock") }
  ];
}

function renderCompareTable(products){
  const root = document.getElementById("compareContent");
  const tr = typeof t === "function" ? t : (k => k);
  const COMPARE_ROWS = getCompareRows();

  if (!products.length){
    root.innerHTML = `<div class="compare-empty">
      <h3>${tr("compare.emptyTitle")}</h3>
      <p>${tr("compare.emptyText")}</p>
    </div>`;
    return;
  }

  const cheapestPrice = Math.min(...products.map(p => p.price));

  const headCells = products.map(p => `
    <th class="compare-col-head">
      <div class="compare-product-card">
        <button class="compare-remove" data-remove-id="${p.id}" title="Remove">✕</button>
        <img src="${p.image_url}" alt="${escapeHTML(p.name)}" class="compare-col-img" onerror="this.src='https://placehold.co/400x300/151923/5B6272?text=Global+Tec'">
        <a href="product-details.html?id=${p.id}" class="compare-col-name">${escapeHTML(p.name)}</a>
        <span class="price compare-col-price">${formatEGP(p.price)}</span>
      </div>
    </th>`).join("");

  const bodyRows = COMPARE_ROWS.map(row => {
    const cells = products.map(p => {
      const raw = row.fmt ? row.fmt(p) : p[row.key];
      const isBest = row.key === "price" && p.price === cheapestPrice && products.length > 1;
      return `<td>${isBest ? `<span class="cell-best">${escapeHTML(String(raw ?? "—"))}</span>` : escapeHTML(String(raw ?? "—"))}</td>`;
    }).join("");
    return `<tr><td>${row.label}</td>${cells}</tr>`;
  }).join("");

  root.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead><tr><th></th>${headCells}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;

  root.querySelectorAll("[data-remove-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      CompareStore.remove(btn.getAttribute("data-remove-id"));
      loadComparePage();
    });
  });
}
