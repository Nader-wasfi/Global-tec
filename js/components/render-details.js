/* ==========================================================================
   RENDER DETAILS — fills product-details.html for a single product.
   ========================================================================== */

function renderProductDetails(p){
  document.getElementById("pageTitleTag").textContent = `${p.name} — Global Tech`;
  document.getElementById("breadcrumbName").textContent = p.name;
  document.getElementById("productBrand").textContent = p.brand;
  document.getElementById("productName").textContent = p.name;

  // SEO / social preview tags
  const shortDesc = `${p.name} — ${p.processor || ""}${p.ram ? ", " + p.ram : ""}. ${formatEGP(p.price)} at Global Tech.`;
  const descTag = document.getElementById("pageDescTag");
  if (descTag) descTag.setAttribute("content", shortDesc);
  const ogTitle = document.getElementById("ogTitleTag");
  if (ogTitle) ogTitle.setAttribute("content", `${p.name} — Global Tech`);
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

  // click the main image (or the zoom hint) to open it full-size
  const mediaWrap = document.getElementById("mainImageWrap");
  if (mediaWrap) mediaWrap.onclick = () => openImageLightbox(mainImg.src, p.name);

  // badges
  const tr = typeof t === "function" ? t : (k => k);
  const badges = [];
  badges.push(p.condition === "new" ? `<span class="badge badge-new">${tr("badge.new")}</span>` : `<span class="badge badge-used">${tr("badge.used")}</span>`);
  if (p.old_price) badges.push(`<span class="badge badge-sale">${tr("badge.save", {n: formatEGP(p.old_price - p.price)})}</span>`);
  if (typeof SITE_INFO !== "undefined" && SITE_INFO.warrantyMonths){
    badges.push(`<span class="badge badge-warranty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5z"/></svg>${tr("details.warranty", {n: SITE_INFO.warrantyMonths})}</span>`);
  }
  document.getElementById("productBadges").innerHTML = badges.join("");

  // star rating — prefers a real average from approved customer reviews,
  // falls back to the admin's manually-entered rating if there are none yet
  const ratingEl = document.getElementById("productRating");
  if (ratingEl && typeof ProductReviewsService !== "undefined"){
    ProductReviewsService.getSummaryForProduct(p.id).then(summary => {
      const r = summary || { rating: p.rating, count: p.rating_count };
      ratingEl.innerHTML = renderStars(r.rating, r.count);
    });
  } else if (ratingEl){
    ratingEl.innerHTML = renderStars(p.rating, p.rating_count);
  }

  // price
  document.getElementById("productPrice").textContent = formatEGP(p.price);
  document.getElementById("productOldPrice").textContent = p.old_price ? formatEGP(p.old_price) : "";

  // stock
  const stockLine = document.getElementById("stockLine");
  if (p.in_stock){
    if (p.stock_quantity != null && p.stock_quantity <= 5){
      stockLine.className = "stock-line low";
      stockLine.innerHTML = `<span class="dot"></span> ${tr("details.onlyXLeft", {n: p.stock_quantity})}`;
    } else {
      stockLine.className = "stock-line";
      stockLine.innerHTML = `<span class="dot"></span> ${tr("details.inStockShip")}`;
    }
  } else {
    stockLine.className = "stock-line out";
    stockLine.innerHTML = `<span class="dot"></span> ${tr("details.outStock")}`;
  }

  // "X people viewed today" — only shows once there's something to show
  const viewsLine = document.getElementById("viewsTodayLine");
  if (viewsLine){
    if (p.views_today && p.views_today > 0){
      viewsLine.textContent = tr("details.viewsToday", {n: p.views_today});
      viewsLine.style.display = "";
    } else {
      viewsLine.style.display = "none";
    }
  }

  // actions
  const addCompareBtn = document.getElementById("addCompareBtn");
  const setCompareLabel = () => {
    addCompareBtn.textContent = CompareStore.has(p.id) ? tr("details.addedCompare") : tr("details.addCompare");
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

  const favBtn = document.getElementById("addFavoriteBtn");
  if (favBtn && typeof FavoritesStore !== "undefined"){
    const setFavState = () => {
      const active = FavoritesStore.has(p.id);
      favBtn.classList.toggle("active", active);
      favBtn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
    };
    setFavState();
    favBtn.onclick = () => {
      FavoritesStore.toggle(p.id);
      setFavState();
      if (typeof ProductsService !== "undefined") ProductsService.adjustFavoriteCount(p.id, FavoritesStore.has(p.id) ? 1 : -1);
    };
  }

  const contactBtn = document.getElementById("contactBtn");
  const specsLine = [p.processor, p.ram, p.storage].filter(Boolean).join(" / ");
  const orderMsg = encodeURIComponent(
    `Hi Global Tech! I'd like to order:\n\n` +
    `${p.name}\n` +
    (specsLine ? `${specsLine}\n` : "") +
    `Price: ${formatEGP(p.price)}\n` +
    `Condition: ${p.condition === "new" ? "New" : "Used"}\n` 
  );
  contactBtn.href = `https://wa.me/${SITE_INFO.whatsappNumber}?text=${orderMsg}`;
  contactBtn.target = "_blank";
  contactBtn.textContent = tr("details.orderNow");
  if (!p.in_stock){
    contactBtn.textContent = tr("details.notifyMe");
  }

  // inspection note (used units only)
  const inspectionNote = document.getElementById("inspectionNote");
  if (p.condition === "used" && typeof SITE_INFO !== "undefined" && SITE_INFO.batteryHealthMin){
    inspectionNote.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
      <span>${tr("details.inspectionNote", {b: SITE_INFO.batteryHealthMin, s: SITE_INFO.storageHealthMin})}</span>`;
  } else {
    inspectionNote.innerHTML = "";
  }

  // quick specs
  const quickSpecs = [
    { label: tr("details.processor"), value: p.processor },
    { label: tr("details.ram"), value: p.ram },
    { label: tr("details.storage"), value: p.storage },
    { label: tr("details.gpu"), value: p.gpu }
  ].filter(s => s.value);
  document.getElementById("quickSpecs").innerHTML = quickSpecs.map(s =>
    `<div class="quick-spec"><div class="label">${s.label}</div><div class="value">${escapeHTML(s.value)}</div></div>`
  ).join("");

  // full specs table
  const fullSpecs = [
    { label: tr("details.brand"), value: p.brand },
    { label: tr("details.condition"), value: p.condition === "new" ? tr("compare.conditionNew") : tr("compare.conditionUsed") },
    { label: tr("details.processor"), value: p.processor },
    { label: tr("details.ram"), value: p.ram },
    { label: tr("details.storage"), value: p.storage },
    { label: tr("details.gpu"), value: p.gpu },
    { label: tr("details.display"), value: p.screen },
    { label: tr("details.availability"), value: p.in_stock ? tr("compare.inStock") : tr("compare.outStock") }
  ].filter(s => s.value);
  document.getElementById("specsTable").innerHTML = fullSpecs.map(s =>
    `<tr><td>${s.label}</td><td>${escapeHTML(s.value)}</td></tr>`
  ).join("");

  document.getElementById("productDescription").textContent = p.description || tr("details.noDescription");

  // "Great For" — automatically derived from specs, no admin input needed.
  // Shows the top 1-2 use cases so it stays focused rather than listing everything.
  const greatForEl = document.getElementById("productGreatFor");
  if (greatForEl){
    const tags = deriveUseCases(p).slice(0, 2);
    if (tags.length){
      greatForEl.innerHTML = `
        <h3 class="great-for-title">${tr("details.greatFor")}</h3>
        <div class="great-for-list">
          ${tags.map(key => `
            <div class="great-for-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
              <div>
                <strong>${USE_CASES[key].label}</strong>
                <p>${USE_CASES[key].reason}</p>
              </div>
            </div>`).join("")}
        </div>`;
      greatForEl.style.display = "";
    } else {
      greatForEl.style.display = "none";
    }
  }

  // Google-friendly structured data — helps the product show price/availability/rating in search results
  injectProductSchema(p);

  // fire-and-forget view counter (also powers "X people viewed today" above)
  if (typeof ProductsService !== "undefined") ProductsService.incrementView(p.id);

  // remember this visit locally, for the "Recently Viewed" section elsewhere on the site
  if (typeof RecentlyViewedStore !== "undefined") RecentlyViewedStore.add(p.id);

  // customer reviews: list + submission form
  initProductReviews(p);
}

function openImageLightbox(src, alt){
  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";
  overlay.innerHTML = `<img src="${src}" alt="${escapeHTML(alt || "")}">`;
  overlay.addEventListener("click", () => overlay.remove());
  document.addEventListener("keydown", function esc(e){
    if (e.key === "Escape"){ overlay.remove(); document.removeEventListener("keydown", esc); }
  });
  document.body.appendChild(overlay);
}

async function initProductReviews(p){
  const listEl = document.getElementById("productReviewsList");
  const formEl = document.getElementById("productReviewForm");
  if (!listEl || typeof ProductReviewsService === "undefined") return;

  const tr = typeof t === "function" ? t : (k => k);
  const reviews = await ProductReviewsService.getApprovedForProduct(p.id);

  listEl.innerHTML = reviews.length
    ? reviews.map(r => `
        <div class="review-item">
          <div class="review-item-head">
            <strong>${escapeHTML(r.customer_name)}</strong>
            ${renderStars(r.rating, null)}
          </div>
          ${r.comment ? `<p>${escapeHTML(r.comment)}</p>` : ""}
        </div>`).join("")
    : `<p class="no-reviews">${tr("reviews.none")}</p>`;

  if (!formEl) return;
  let chosenRating = 0;
  const starPicker = formEl.querySelector(".star-picker");
  const paintPicker = () => {
    starPicker.querySelectorAll("button").forEach(btn => {
      btn.classList.toggle("filled", Number(btn.dataset.val) <= chosenRating);
    });
  };
  starPicker.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => { chosenRating = Number(btn.dataset.val); paintPicker(); });
  });

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("reviewName");
    const commentInput = document.getElementById("reviewComment");
    const statusEl = document.getElementById("reviewFormStatus");

    if (!chosenRating || !nameInput.value.trim()){
      statusEl.textContent = tr("reviews.needRatingAndName");
      statusEl.className = "review-form-status error";
      return;
    }

    try {
      await ProductReviewsService.submit(p.id, nameInput.value.trim(), chosenRating, commentInput.value.trim());
      statusEl.textContent = tr("reviews.submitted");
      statusEl.className = "review-form-status success";
      formEl.reset();
      chosenRating = 0;
      paintPicker();
    } catch (err){
      statusEl.textContent = tr("reviews.submitFailed");
      statusEl.className = "review-form-status error";
    }
  });
}

function injectProductSchema(p){
  const existing = document.getElementById("productSchema");
  if (existing) existing.remove();

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "image": (p.image_gallery && p.image_gallery.length) ? p.image_gallery : [p.image_url],
    "description": p.description || `${p.name} — ${p.processor || ""} ${p.ram || ""}`.trim(),
    "brand": { "@type": "Brand", "name": p.brand },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "EGP",
      "price": p.price,
      "availability": p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": p.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
    }
  };
  if (p.rating && p.rating_count){
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.rating_count
    };
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "productSchema";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/* Related products: prioritizes same category, then same brand, then
   fills the rest with similarly priced items — so a laptop page never
   suggests accessories and vice-versa. */
function renderRelatedProducts(current, allProducts){
  const section = document.getElementById("relatedSection");
  const grid = document.getElementById("relatedGrid");
  if (!section || !grid) return;

  const currentCategory = current.category || "laptop";
  const pool = allProducts.filter(p => p.id !== current.id && (p.category || "laptop") === currentCategory);
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
  bindFavoriteToggles(grid);
  section.style.display = "";
}
