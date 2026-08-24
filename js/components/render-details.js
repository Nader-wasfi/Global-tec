/* ==========================================================================
   RENDER DETAILS — fills product-details.html for a single product.
   ========================================================================== */

const WHATSAPP_NUMBER = "201000000000"; // update to the real business number

function renderProductDetails(p){
  document.getElementById("pageTitleTag").textContent = `${p.name} — Global Tec`;
  document.getElementById("breadcrumbName").textContent = p.name;
  document.getElementById("productBrand").textContent = p.brand;
  document.getElementById("productName").textContent = p.name;

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
  if (p.old_price) badges.push('<span class="badge badge-sale">On Sale</span>');
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
  contactBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  contactBtn.target = "_blank";
  if (!p.in_stock){
    contactBtn.textContent = "Notify Me When Available";
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
