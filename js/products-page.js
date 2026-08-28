/* ==========================================================================
   PRODUCTS PAGE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);

  const state = {
    condition: params.getAll("condition").length ? params.getAll("condition") : (params.get("condition") ? [params.get("condition")] : []),
    brand: params.get("brand") ? [params.get("brand")] : [],
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

  // reflect condition checkboxes
  document.querySelectorAll('input[name="condition"]').forEach(cb => {
    cb.checked = state.condition.includes(cb.value);
  });
  // reflect stock checkboxes
  document.querySelectorAll('input[name="stock"]').forEach(cb => {
    cb.checked = state.stock.includes(cb.value);
  });
  document.getElementById("minPrice").value = state.minPrice;
  document.getElementById("maxPrice").value = state.maxPrice;
  document.getElementById("sortSelect").value = state.sort;
  document.getElementById("touchFilter").checked = state.touch;
  if (state.search) document.getElementById("headerSearch").value = state.search;

  function readFormFilters(){
    return {
      condition: Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(el => el.value),
      brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
      stock: Array.from(document.querySelectorAll('input[name="stock"]:checked')).map(el => el.value),
      touch: document.getElementById("touchFilter").checked,
      minPrice: document.getElementById("minPrice").value,
      maxPrice: document.getElementById("maxPrice").value,
      search: state.search,
      sort: document.getElementById("sortSelect").value
    };
  }

  function updatePageChrome(filters){
    let title = "All Laptops";
    if (filters.condition.length === 1) title = filters.condition[0] === "new" ? "Brand New Laptops" : "Certified Used Laptops";
    if (filters.search) title = `Search: "${filters.search}"`;
    document.getElementById("pageTitle").textContent = title;
    document.getElementById("breadcrumbCurrent").textContent = title;
    document.title = `${title} — Global Tec`;
  }

  function renderActiveChips(filters){
    const chips = [];
    filters.condition.forEach(c => chips.push({ label: c === "new" ? "New" : "Used", clear: () => {
      document.querySelector(`input[name="condition"][value="${c}"]`).checked = false;
    }}));
    filters.brand.forEach(b => chips.push({ label: b, clear: () => {
      document.querySelector(`input[name="brand"][value="${b}"]`).checked = false;
    }}));
    filters.stock.forEach(s => chips.push({ label: s === "in" ? "In Stock" : "Out of Stock", clear: () => {
      document.querySelector(`input[name="stock"][value="${s}"]`).checked = false;
    }}));
    if (filters.touch) chips.push({ label: "Touch Screen", clear: () => {
      document.getElementById("touchFilter").checked = false;
    }});
    if (filters.minPrice || filters.maxPrice) chips.push({ label: `${filters.minPrice || 0}–${filters.maxPrice || "∞"} EGP`, clear: () => {
      document.getElementById("minPrice").value = ""; document.getElementById("maxPrice").value = "";
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
    document.getElementById("resultsCount").textContent =
      `${results.length} laptop${results.length === 1 ? "" : "s"} found`;
    renderProductGrid("productsGrid", results);
  }

  document.getElementById("applyFilters").addEventListener("click", runQuery);
  document.getElementById("sortSelect").addEventListener("change", runQuery);
  document.getElementById("resetBrand").addEventListener("click", () => {
    document.querySelectorAll('input[name="brand"]').forEach(cb => cb.checked = false);
    runQuery();
  });
  // condition checkboxes react instantly
  document.querySelectorAll('input[name="condition"]').forEach(cb => cb.addEventListener("change", runQuery));
  // stock checkboxes react instantly
  document.querySelectorAll('input[name="stock"]').forEach(cb => cb.addEventListener("change", runQuery));
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
