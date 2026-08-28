/* ==========================================================================
   RENDER DETAILS — fills product-details.html for a single product.
   ========================================================================== */

function renderProductDetails(p){
  document.getElementById("pageTitleTag").textContent = `${p.name} — Global Tec`;
  document.getElementById("breadcrumbName").textContent = p.name;
  document.getElementById("productBrand").textContent = p.brand;
  document.getElementById("productName").textContent = p.name;

  // SEO / social preview tags
  const shortDesc = `${p.name} — ${p.processor || ""}${p.ram ? ", " + p.ram : ""}. ${formatEGP(p.price)} at Global Tec.`;
  const descTag = document.getElementById("pageDescTag");
  if (descTag) descTag.setAttribute("content", shortDesc);
  const ogTitle = document.getElementById("ogTitleTag");
  if (ogTitle) ogTitle.setAttribute("content", `${p.name} — Global Tec`);
  const ogDesc = document.getElementById("ogDescTag");
  if (ogDesc) ogDesc.setAttribute("content", shortDesc);
  const ogImage = document.getElementById("ogImageTag");
  if (ogImage) ogImage.setAttribute("content", p.image_url || "");

  // gallery
  const gallery = (p.image_gallery && p.image_gallery.length) ? p.image_gallery : [p.image_url];
  const mainImg = document.getElementById("mainImage");
  mainImg.src = gallery[0];
  mainImg.alt = p.name;
  mainImg.onerror = () => { mainImg.src = "https://placehold.co/700x525/151923/5B6272?text=Global+Tec"; };

  const thumbsEl = document.getElementById("galleryThumbs");
  if (gallery.length > 1){
    thumbsEl.innerHTML = gallery.map((src, i) =>
      `<img src="${src}" data-idx="${i}" class="${i === 0 ? 'active' : ''}" alt="${escapeHTML(p.name)} view ${i+1}">`
    ).join("");
    thumbsEl.querySelectorAll("img").forEach(img => {
      img.addEventListener("click", () => {
        mainImg.src = img.src;
        thumbsEl.querySelectorAll("img").forEach(t => t.classList.remove("active"));
        img.classList.add("active");
      });
    });
  } else {
    thumbsEl.innerHTML = "";
  }

  // badges
  const badges = [];
  badges.push(p.condition === "new" ? '<span class="badge badge-new">New</span>' : '<span class="badge badge-used">Used</span>');
  if (p.old_price) badges.push(`<span class="badge badge-sale">Save ${formatEGP(p.old_price - p.price)}</span>`);
  if (typeof SITE_INFO !== "undefined" && SITE_INFO.warrantyMonths){
    badges.push(`<span class="badge badge-warranty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5z"/></svg>${SITE_INFO.warrantyMonths}-Month Warranty</span>`);
  }
  document.getElementById("productBadges").innerHTML = badges.join("");

  // price
  document.getElementById("productPrice").textContent = formatEGP(p.price);
  document.getElementById("productOldPrice").textContent = p.old_price ? formatEGP(p.old_price) : "";

  // stock
  const stockLine = document.getElementById("stockLine");
  if (p.in_stock){
    stockLine.className = "stock-line";
    stockLine.innerHTML = '<span class="dot"></span> In stock — ships within 24–48h';
  } else {
    stockLine.className = "stock-line out";
    stockLine.innerHTML = '<span class="dot"></span> Currently out of stock';
  }

  // actions
  const addCompareBtn = document.getElementById("addCompareBtn");
  const setCompareLabel = () => {
    addCompareBtn.textContent = CompareStore.has(p.id) ? "✓ Added to Compare" : "+ Add to Compare";
  };
  setCompareLabel();
  addCompareBtn.onclick = () => {
    const result = CompareStore.toggle(p.id);
    if (result.ok === false && result.reason === "limit"){
      alert(`You can compare up to ${CompareStore.MAX} laptops at a time. Remove one first.`);
      return;
    }
    setCompareLabel();
  };

  const contactBtn = document.getElementById("contactBtn");
  const msg = encodeURIComponent(`Hi Global Tec, I'm interested in the ${p.name} (${formatEGP(p.price)}). Is it available?`);
  contactBtn.href = `https://wa.me/${SITE_INFO.whatsappNumber}?text=${msg}`;
  contactBtn.target = "_blank";
  if (!p.in_stock){
    contactBtn.textContent = "Notify Me When Available";
  }

  // inspection note (used units only)
  const inspectionNote = document.getElementById("inspectionNote");
  if (p.condition === "used" && typeof SITE_INFO !== "undefined" && SITE_INFO.batteryHealthMin){
    inspectionNote.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
      <span>Inspected before listing — battery health ${SITE_INFO.batteryHealthMin}%+ and storage health ${SITE_INFO.storageHealthMin}%+, guaranteed.</span>`;
  } else {
    inspectionNote.innerHTML = "";
  }

  // quick specs
  const quickSpecs = [
    { label: "Processor", value: p.processor },
    { label: "RAM", value: p.ram },
    { label: "Storage", value: p.storage },
    { label: "GPU", value: p.gpu }
  ].filter(s => s.value);
  document.getElementById("quickSpecs").innerHTML = quickSpecs.map(s =>
    `<div class="quick-spec"><div class="label">${s.label}</div><div class="value">${escapeHTML(s.value)}</div></div>`
  ).join("");

  // full specs table
  const fullSpecs = [
    { label: "Brand", value: p.brand },
    { label: "Condition", value: p.condition === "new" ? "Brand New" : "Used — Inspected" },
    { label: "Processor", value: p.processor },
    { label: "RAM", value: p.ram },
    { label: "Storage", value: p.storage },
    { label: "Graphics", value: p.gpu },
    { label: "Display", value: p.screen },
    { label: "Availability", value: p.in_stock ? "In stock" : "Out of stock" }
  ].filter(s => s.value);
  document.getElementById("specsTable").innerHTML = fullSpecs.map(s =>
    `<tr><td>${s.label}</td><td>${escapeHTML(s.value)}</td></tr>`
  ).join("");

  document.getElementById("productDescription").textContent = p.description || "No description provided yet.";
}

/* Related products: same brand first, then fills with nearby-priced laptops. */
function renderRelatedProducts(current, allProducts){
  const section = document.getElementById("relatedSection");
  const grid = document.getElementById("relatedGrid");
  if (!section || !grid) return;

  const pool = allProducts.filter(p => p.id !== current.id);
  const sameBrand = pool.filter(p => p.brand === current.brand);
  const priceSorted = [...pool].sort((a, b) =>
    Math.abs(a.price - current.price) - Math.abs(b.price - current.price)
  );

  const related = [];
  const seen = new Set();
  [...sameBrand, ...priceSorted].forEach(p => {
    if (related.length < 4 && !seen.has(p.id)){ related.push(p); seen.add(p.id); }
  });

  if (!related.length) return;
  grid.innerHTML = related.map(productCardHTML).join("");
  bindCompareToggles(grid);
  section.style.display = "";
}
