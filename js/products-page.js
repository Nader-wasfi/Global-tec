/* ==========================================================================
   PRODUCTS PAGE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);

  showSkeletonGrid("productsGrid", 8);

  const tr = typeof t === "function" ? t : (k => k);

  const state = {
    condition: params.getAll("condition").length ? params.getAll("condition") : (params.get("condition") ? [params.get("condition")] : []),
    brand: params.get("brand") ? [params.get("brand")] : [],
    category: params.getAll("category").length ? params.getAll("category") : (params.get("category") ? [params.get("category")] : []),
    ram: params.getAll("ram").length ? params.getAll("ram") : (params.get("ram") ? [params.get("ram")] : []),
    storage: params.getAll("storage").length ? params.getAll("storage") : (params.get("storage") ? [params.get("storage")] : []),
    screenSize: params.getAll("screen").length ? params.getAll("screen") : (params.get("screen") ? [params.get("screen")] : []),
    useCase: params.getAll("use").length ? params.getAll("use") : (params.get("use") ? [params.get("use")] : []),
    stock: params.getAll("stock").length ? params.getAll("stock") : (params.get("stock") ? [params.get("stock")] : []),
    touch: params.get("touch") === "1",
    minPrice: params.get("min") || "",
    maxPrice: params.get("max") || "",
    search: params.get("search") || "",
    sort: params.get("sort") || "newest"
  };

  // build brand filter list from catalog
  const brands = await ProductsService.getBrands();
  const brandListEl = document.getElementById("brandFilterList");
  brandListEl.innerHTML = brands.map(b => `
    <label class="filter-option">
      <input type="checkbox" name="brand" value="${b.brand}" ${state.brand.includes(b.brand) ? "checked" : ""}>
      ${b.brand} <span class="fcount">${b.count}</span>
    </label>`).join("");

  // build screen size filter list from whatever sizes actually exist in the catalog
  const allProductsForSizes = await ProductsService.getAll();
  const sizeCounts = {};
  allProductsForSizes.forEach(p => {
    const size = extractScreenSize(p.screen);
    if (size) sizeCounts[size] = (sizeCounts[size] || 0) + 1;
  });
  const sortedSizes = Object.keys(sizeCounts).sort((a, b) => parseFloat(a) - parseFloat(b));
  const screenSizeListEl = document.getElementById("screenSizeFilterList");
  screenSizeListEl.innerHTML = sortedSizes.length
    ? sortedSizes.map(size => `
        <label class="filter-option">
          <input type="checkbox" name="screenSize" value="${size}" ${state.screenSize.includes(size) ? "checked" : ""}>
          ${size}" <span class="fcount">${sizeCounts[size]}</span>
        </label>`).join("")
    : `<span style="color:var(--text-faint); font-size:var(--fs-xs);">No screen sizes on file yet</span>`;

  // price slider bounds — derived from whatever's actually in the catalog
  const catalogPrices = allProductsForSizes.map(p => p.price).filter(n => typeof n === "number");
  const priceFloor = catalogPrices.length ? Math.floor(Math.min(...catalogPrices) / 500) * 500 : 0;
  const priceCeil = catalogPrices.length ? Math.ceil(Math.max(...catalogPrices) / 500) * 500 : 100000;
  initPriceSlider(priceFloor, priceCeil, state.minPrice, state.maxPrice);

  // reflect category checkboxes
  document.querySelectorAll('input[name="category"]').forEach(cb => {
    cb.checked = state.category.includes(cb.value);
  });
  // reflect condition checkboxes
  document.querySelectorAll('input[name="condition"]').forEach(cb => {
    cb.checked = state.condition.includes(cb.value);
  });
  // reflect use-case checkboxes
  document.querySelectorAll('input[name="useCase"]').forEach(cb => {
    cb.checked = state.useCase.includes(cb.value);
  });
  // reflect stock checkboxes
  document.querySelectorAll('input[name="stock"]').forEach(cb => {
    cb.checked = state.stock.includes(cb.value);
  });
  document.getElementById("sortSelect").value = state.sort;
  document.getElementById("touchFilter").checked = state.touch;
  if (state.search) document.getElementById("headerSearch").value = state.search;

  function readFormFilters(){
    return {
      condition: Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(el => el.value),
      brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
      category: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value),
      ram: Array.from(document.querySelectorAll('input[name="ram"]:checked')).map(el => el.value),
      storage: Array.from(document.querySelectorAll('input[name="storage"]:checked')).map(el => el.value),
      screenSize: Array.from(document.querySelectorAll('input[name="screenSize"]:checked')).map(el => el.value),
      useCase: Array.from(document.querySelectorAll('input[name="useCase"]:checked')).map(el => el.value),
      stock: Array.from(document.querySelectorAll('input[name="stock"]:checked')).map(el => el.value),
      touch: document.getElementById("touchFilter").checked,
      minPrice: document.getElementById("minPrice").value,
      maxPrice: document.getElementById("maxPrice").value,
      search: state.search,
      sort: document.getElementById("sortSelect").value
    };
  }

  function updatePageChrome(filters){
    let title = tr("products.title");
    if (filters.category.length === 1 && filters.category[0] === "accessory") title = tr("products.accessories");
    if (filters.condition.length === 1) title = filters.condition[0] === "new" ? tr("products.newLaptops") : tr("products.usedLaptops");
    if (filters.search) title = `${tr("products.searchPrefix")}: "${filters.search}"`;
    document.getElementById("pageTitle").textContent = title;
    document.getElementById("breadcrumbCurrent").textContent = title;
    document.title = `${title} — Global Tech`;
  }

  function renderActiveChips(filters){
    const chips = [];
    filters.category.forEach(c => chips.push({ label: c === "accessory" ? tr("nav.accessories") : tr("nav.allLaptops"), clear: () => {
      document.querySelector(`input[name="category"][value="${c}"]`).checked = false;
    }}));
    filters.condition.forEach(c => chips.push({ label: c === "new" ? tr("products.new") : tr("nav.used"), clear: () => {
      document.querySelector(`input[name="condition"][value="${c}"]`).checked = false;
    }}));
    filters.brand.forEach(b => chips.push({ label: b, clear: () => {
      document.querySelector(`input[name="brand"][value="${b}"]`).checked = false;
    }}));
    filters.ram.forEach(r => chips.push({ label: `${r} RAM`, clear: () => {
      document.querySelector(`input[name="ram"][value="${r}"]`).checked = false;
    }}));
    filters.storage.forEach(s => chips.push({ label: s, clear: () => {
      document.querySelector(`input[name="storage"][value="${s}"]`).checked = false;
    }}));
    filters.screenSize.forEach(sz => chips.push({ label: `${sz}"`, clear: () => {
      document.querySelector(`input[name="screenSize"][value="${sz}"]`).checked = false;
    }}));
    filters.useCase.forEach(uc => chips.push({ label: USE_CASES[uc] ? USE_CASES[uc].label : uc, clear: () => {
      document.querySelector(`input[name="useCase"][value="${uc}"]`).checked = false;
    }}));
    filters.stock.forEach(s => chips.push({ label: s === "in" ? tr("products.inStock") : tr("products.outStock"), clear: () => {
      document.querySelector(`input[name="stock"][value="${s}"]`).checked = false;
    }}));
    if (filters.touch) chips.push({ label: tr("products.touchScreen"), clear: () => {
      document.getElementById("touchFilter").checked = false;
    }});
    if (filters.minPrice || filters.maxPrice) chips.push({ label: `${filters.minPrice || 0}–${filters.maxPrice || "∞"} EGP`, clear: () => {
      resetPriceSlider();
    }});
    if (filters.search) chips.push({ label: `"${filters.search}"`, clear: () => { state.search = ""; runQuery(); } });

    const row = document.getElementById("activeFiltersRow");
    if (!chips.length){ row.innerHTML = ""; return; }
    row.innerHTML = chips.map((c, i) => `<span class="active-chip" data-chip="${i}">${escapeHTML(c.label)} <button>✕</button></span>`).join("");
    row.querySelectorAll(".active-chip").forEach((el, i) => {
      el.querySelector("button").addEventListener("click", () => { chips[i].clear(); runQuery(); });
    });
  }

  async function runQuery(){
    const filters = readFormFilters();
    updatePageChrome(filters);
    renderActiveChips(filters);
    const results = await ProductsService.query(filters);
    document.getElementById("resultsCount").textContent = tr("products.resultsCount", {n: results.length, s: results.length === 1 ? "" : "s"});
    renderProductGrid("productsGrid", results);
  }

  var resetPriceSlider = () => {};

  function initPriceSlider(lo, hi, initialMin, initialMax){
    const minInput = document.getElementById("priceRangeMin");
    const maxInput = document.getElementById("priceRangeMax");
    const rangeEl = document.getElementById("priceSliderRange");
    const minLabel = document.getElementById("priceMinLabel");
    const maxLabel = document.getElementById("priceMaxLabel");
    const hiddenMin = document.getElementById("minPrice");
    const hiddenMax = document.getElementById("maxPrice");

    if (hi <= lo) hi = lo + 1000; // guard against a single-price catalog

    [minInput, maxInput].forEach(el => { el.min = lo; el.max = hi; el.step = 500; });
    minInput.value = initialMin !== "" ? initialMin : lo;
    maxInput.value = initialMax !== "" ? initialMax : hi;

    function paint(){
      const pct = v => ((v - lo) / (hi - lo)) * 100;
      const minVal = Number(minInput.value);
      const maxVal = Number(maxInput.value);
      rangeEl.style.left = pct(minVal) + "%";
      rangeEl.style.right = (100 - pct(maxVal)) + "%";
      minLabel.textContent = formatEGP(minVal);
      maxLabel.textContent = formatEGP(maxVal);
      hiddenMin.value = minVal <= lo ? "" : minVal;
      hiddenMax.value = maxVal >= hi ? "" : maxVal;
    }

    minInput.addEventListener("input", () => {
      if (Number(minInput.value) > Number(maxInput.value)) minInput.value = maxInput.value;
      paint();
    });
    maxInput.addEventListener("input", () => {
      if (Number(maxInput.value) < Number(minInput.value)) maxInput.value = minInput.value;
      paint();
    });
    minInput.addEventListener("change", runQuery);
    maxInput.addEventListener("change", runQuery);

    resetPriceSlider = () => { minInput.value = lo; maxInput.value = hi; paint(); };

    paint();
  }

  document.getElementById("applyFilters").addEventListener("click", runQuery);
  document.getElementById("sortSelect").addEventListener("change", runQuery);
  document.getElementById("resetBrand").addEventListener("click", () => {
    document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = false);
    runQuery();
  });
  document.getElementById("clearAllFilters").addEventListener("click", () => {
    document.querySelectorAll('.filters-panel input[type="checkbox"]').forEach(cb => cb.checked = false);
    resetPriceSlider();
    document.getElementById("sortSelect").value = "newest";
    state.search = "";
    document.getElementById("headerSearch").value = "";
    runQuery();
  });

  // ---- density toggle (compact / comfortable), remembered per visitor ----
  const grid = document.getElementById("productsGrid");
  const densityBtns = document.querySelectorAll("#densityToggle button");
  const savedDensity = localStorage.getItem("globaltec_density") || "comfortable";
  grid.classList.toggle("compact", savedDensity === "compact");
  densityBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.density === savedDensity));
  densityBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const density = btn.dataset.density;
      grid.classList.toggle("compact", density === "compact");
      densityBtns.forEach(b => b.classList.toggle("active", b === btn));
      localStorage.setItem("globaltec_density", density);
    });
  });
  // category checkboxes react instantly
  document.querySelectorAll('input[name="category"]').forEach(cb => cb.addEventListener("change", runQuery));
  // condition checkboxes react instantly
  document.querySelectorAll('input[name="condition"]').forEach(cb => cb.addEventListener("change", runQuery));
  // stock checkboxes react instantly
  document.querySelectorAll('input[name="stock"]').forEach(cb => cb.addEventListener("change", runQuery));
  // ram / storage / screen size checkboxes react instantly
  document.querySelectorAll('input[name="ram"]').forEach(cb => cb.addEventListener("change", runQuery));
  document.querySelectorAll('input[name="storage"]').forEach(cb => cb.addEventListener("change", runQuery));
  document.querySelectorAll('input[name="screenSize"]').forEach(cb => cb.addEventListener("change", runQuery));
  document.querySelectorAll('input[name="useCase"]').forEach(cb => cb.addEventListener("change", runQuery));
  // touch filter reacts instantly
  document.getElementById("touchFilter").addEventListener("change", runQuery);

  // mobile filter drawer
  const panel = document.getElementById("filtersPanel");
  const backdrop = document.getElementById("filtersBackdrop");
  const toggleBtn = document.getElementById("mobileFilterToggle");
  const closeDrawer = () => { panel.classList.remove("open"); backdrop.classList.remove("open"); };
  if (toggleBtn){
    toggleBtn.addEventListener("click", () => { panel.classList.add("open"); backdrop.classList.add("open"); });
    backdrop.addEventListener("click", closeDrawer);
  }

  runQuery();

});
