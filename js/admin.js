/* ==========================================================================
   ADMIN PANEL
   Auth-gated CRUD for the products table, with image upload straight to
   the "product-images" Supabase Storage bucket. Relies on the RLS policies
   in sql/schema.sql: only a signed-in user can insert/update/delete.
   ========================================================================== */

let currentImages = [];   // URLs for the product currently being added/edited
let editingId = null;     // null while adding a new product
let currentTab = "laptop"; // "laptop" | "accessory" | "reviews"

document.addEventListener("DOMContentLoaded", () => {
  if (typeof supabaseClient === "undefined"){
    document.getElementById("loginError").textContent =
      "Supabase isn't configured yet — check js/data/supabase-config.js.";
    document.getElementById("loginError").classList.add("show");
    return;
  }

  // ---- auth state ----
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session) showDashboard(data.session.user);
    else showLogin();
  });

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) showDashboard(session.user);
    else showLogin();
  });

  // ---- login ----
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errEl = document.getElementById("loginError");
    const btn = document.getElementById("loginBtn");

    errEl.classList.remove("show");
    btn.disabled = true; btn.textContent = "Signing in...";

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    btn.disabled = false; btn.textContent = "Sign In";
    if (error){
      errEl.textContent = error.message;
      errEl.classList.add("show");
    }
  });

  // ---- logout ----
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
  });

  // ---- tabs: Laptops / Accessories / Homepage Reviews / Product Reviews / Stats ----
  document.querySelectorAll(".admin-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".admin-tab").forEach(b => b.classList.toggle("active", b === btn));

      const panels = {
        laptop: "productsPanel", accessory: "productsPanel",
        reviews: "reviewsPanel", productReviews: "productReviewsPanel", stats: "statsPanel"
      };
      Object.values(panels).forEach((id, i, arr) => {
        // avoid hiding/showing the same panel id twice when laptop/accessory share it
        if (arr.indexOf(id) === i) document.getElementById(id).style.display = "none";
      });
      document.getElementById(panels[currentTab]).style.display = "";

      if (currentTab === "reviews"){
        loadReviewList();
      } else if (currentTab === "productReviews"){
        loadProductReviewsModeration();
      } else if (currentTab === "stats"){
        loadStats();
      } else {
        document.getElementById("productsPanelTitle").textContent = currentTab === "laptop" ? "Laptops" : "Accessories";
        loadProductList();
      }
    });
  });

  // ---- modal open/close ----
  document.getElementById("addProductBtn").addEventListener("click", () => openModal());
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("cancelFormBtn").addEventListener("click", closeModal);
  document.getElementById("productModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "productModalBackdrop") closeModal();
  });

  // ---- image upload (product photos) ----
  const dropzone = document.getElementById("imageDropzone");
  const fileInput = document.getElementById("imageInput");
  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => handleFiles(fileInput.files));
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.classList.add("dragover"); });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  // ---- image upload (review screenshots) ----
  const reviewDropzone = document.getElementById("reviewDropzone");
  const reviewInput = document.getElementById("reviewInput");
  reviewDropzone.addEventListener("click", () => reviewInput.click());
  reviewInput.addEventListener("change", () => handleReviewFiles(reviewInput.files));
  reviewDropzone.addEventListener("dragover", (e) => { e.preventDefault(); reviewDropzone.classList.add("dragover"); });
  reviewDropzone.addEventListener("dragleave", () => reviewDropzone.classList.remove("dragover"));
  reviewDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    reviewDropzone.classList.remove("dragover");
    handleReviewFiles(e.dataTransfer.files);
  });

  // ---- form submit ----
  document.getElementById("productForm").addEventListener("submit", saveProduct);
});

function showLogin(){
  document.getElementById("adminLogin").style.display = "flex";
  document.getElementById("adminDashboard").style.display = "none";
}

function showDashboard(user){
  document.getElementById("adminLogin").style.display = "none";
  document.getElementById("adminDashboard").style.display = "block";
  document.getElementById("adminUserEmail").textContent = user.email;
  loadProductList();
}

async function loadProductList(){
  ProductsService.invalidateCache();
  const all = await ProductsService.getAll();
  const products = all.filter(p => (p.category || "laptop") === currentTab);
  const rowsEl = document.getElementById("productRows");
  document.getElementById("productCount").textContent = `${products.length} item${products.length === 1 ? "" : "s"}`;

  if (!products.length){
    rowsEl.innerHTML = `<div class="admin-empty">No ${currentTab === "laptop" ? "laptops" : "accessories"} yet — click "Add New Product" to create your first listing.</div>`;
    return;
  }

  rowsEl.innerHTML = products.map(p => `
    <div class="admin-row" data-id="${p.id}">
      <img src="${p.image_url || 'https://placehold.co/100x100/151923/5B6272?text=—'}" alt="">
      <div>
        <div class="name">${escapeHTML(p.name)}</div>
        <div class="brand">${escapeHTML(p.brand)} · ${p.condition}</div>
      </div>
      <span class="price-cell">${formatEGP(p.price)}</span>
      <span class="stock-cell">${p.in_stock ? "In Stock" : "Out of Stock"}</span>
      <div class="admin-row-actions">
        <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button>
        <button class="btn btn-ghost btn-sm" data-duplicate="${p.id}">Duplicate</button>
        <button class="btn btn-ghost btn-sm" data-delete="${p.id}">Delete</button>
      </div>
    </div>`).join("");

  rowsEl.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const product = await ProductsService.getById(btn.getAttribute("data-edit"));
      if (product) openModal(product);
    });
  });
  rowsEl.querySelectorAll("[data-duplicate]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const product = await ProductsService.getById(btn.getAttribute("data-duplicate"));
      if (product) openModal({ ...product, name: product.name + " (Copy)" }, true);
    });
  });
  rowsEl.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-delete")));
  });
}

async function loadReviewList(){
  ReviewsService.invalidateCache();
  const reviews = await ReviewsService.getAll();
  document.getElementById("reviewCount").textContent = `${reviews.length} item${reviews.length === 1 ? "" : "s"}`;

  const wrap = document.getElementById("reviewThumbs");
  wrap.innerHTML = reviews.map(r => `
    <div class="image-thumb">
      <img src="${r.image_url}" alt="">
      <button type="button" class="remove-thumb" data-remove-review="${r.id}">✕</button>
    </div>`).join("");

  wrap.querySelectorAll("[data-remove-review]").forEach(btn => {
    btn.addEventListener("click", () => deleteReview(btn.getAttribute("data-remove-review")));
  });
}

function openModal(product, isDuplicate){
  const isNew = !product || isDuplicate;
  editingId = isNew ? null : product.id;
  currentImages = product ? [...(product.image_gallery || [])] : [];

  document.getElementById("modalTitle").textContent = isNew
    ? (currentTab === "laptop" ? "Add New Laptop" : "Add New Accessory")
    : "Edit Product";
  document.getElementById("pId").value = isNew ? makeId() : product.id;
  document.getElementById("pCategory").value = product ? (product.category || "laptop") : currentTab;
  document.getElementById("pName").value = product ? product.name : "";
  document.getElementById("pBrand").value = product ? product.brand : "";
  document.getElementById("pCondition").value = product ? product.condition : "used";
  document.getElementById("pPrice").value = product ? product.price : "";
  document.getElementById("pOldPrice").value = product && product.old_price != null ? product.old_price : "";
  document.getElementById("pRating").value = product && product.rating != null ? product.rating : "";
  document.getElementById("pRatingCount").value = product && product.rating_count != null ? product.rating_count : "";
  document.getElementById("pProcessor").value = product ? (product.processor || "") : "";
  document.getElementById("pRam").value = product ? (product.ram || "") : "";
  document.getElementById("pStorage").value = product ? (product.storage || "") : "";
  document.getElementById("pGpu").value = product ? (product.gpu || "") : "";
  document.getElementById("pScreen").value = product ? (product.screen || "") : "";
  document.getElementById("pDescription").value = product ? (product.description || "") : "";
  document.getElementById("pInStock").checked = product ? !!product.in_stock : true;
  document.getElementById("pStockQuantity").value = product && product.stock_quantity != null ? product.stock_quantity : "";
  document.getElementById("formError").classList.remove("show");

  renderImageThumbs();
  document.getElementById("productModalBackdrop").classList.add("open");
}

function closeModal(){
  document.getElementById("productModalBackdrop").classList.remove("open");
  document.getElementById("productForm").reset();
  currentImages = [];
  editingId = null;
}

function makeId(){
  return "p-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

function renderImageThumbs(){
  const wrap = document.getElementById("imageThumbs");
  wrap.innerHTML = currentImages.map((url, i) => `
    <div class="image-thumb">
      <img src="${url}" alt="">
      <button type="button" class="remove-thumb" data-remove-img="${i}">✕</button>
    </div>`).join("");
  wrap.querySelectorAll("[data-remove-img]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentImages.splice(Number(btn.getAttribute("data-remove-img")), 1);
      renderImageThumbs();
    });
  });
}

async function handleFiles(fileList){
  const productId = document.getElementById("pId").value || makeId();
  document.getElementById("pId").value = productId;

  const files = Array.from(fileList);
  for (const file of files){
    const placeholder = document.createElement("div");
    placeholder.className = "image-thumb uploading";
    placeholder.textContent = "Uploading…";
    document.getElementById("imageThumbs").appendChild(placeholder);

    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("product-images")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: pub } = supabaseClient.storage.from("product-images").getPublicUrl(path);
      currentImages.push(pub.publicUrl);
      renderImageThumbs();
    } catch (err){
      alert("Image upload failed: " + err.message);
      placeholder.remove();
    }
  }
}

async function saveProduct(e){
  e.preventDefault();
  const errEl = document.getElementById("formError");
  errEl.classList.remove("show");

  const name = document.getElementById("pName").value.trim();
  const brand = document.getElementById("pBrand").value.trim();
  const price = Number(document.getElementById("pPrice").value);

  if (!name || !brand || !price){
    errEl.textContent = "Name, brand, and price are required.";
    errEl.classList.add("show");
    return;
  }

  const oldPriceRaw = document.getElementById("pOldPrice").value;
  const ratingRaw = document.getElementById("pRating").value;
  const ratingCountRaw = document.getElementById("pRatingCount").value;

  const product = {
    id: document.getElementById("pId").value,
    name,
    brand,
    category: document.getElementById("pCategory").value,
    condition: document.getElementById("pCondition").value,
    price,
    old_price: oldPriceRaw === "" ? null : Number(oldPriceRaw),
    rating: ratingRaw === "" ? null : Number(ratingRaw),
    rating_count: ratingCountRaw === "" ? 0 : Number(ratingCountRaw),
    processor: document.getElementById("pProcessor").value.trim(),
    ram: document.getElementById("pRam").value.trim(),
    storage: document.getElementById("pStorage").value.trim(),
    gpu: document.getElementById("pGpu").value.trim(),
    screen: document.getElementById("pScreen").value.trim(),
    description: document.getElementById("pDescription").value.trim(),
    image_url: currentImages[0] || "",
    image_gallery: currentImages,
    in_stock: document.getElementById("pInStock").checked,
    stock_quantity: document.getElementById("pStockQuantity").value === "" ? null : Number(document.getElementById("pStockQuantity").value)
  };

  const saveBtn = document.getElementById("saveProductBtn");
  saveBtn.disabled = true; saveBtn.textContent = "Saving...";

  let error;
  if (editingId){
    ({ error } = await supabaseClient.from("products").update(product).eq("id", editingId));
  } else {
    ({ error } = await supabaseClient.from("products").insert(product));
  }

  saveBtn.disabled = false; saveBtn.textContent = "Save Product";

  if (error){
    errEl.textContent = error.message;
    errEl.classList.add("show");
    return;
  }

  closeModal();
  loadProductList();
}

async function deleteProduct(id){
  if (!confirm("Delete this product? This can't be undone.")) return;
  const { error } = await supabaseClient.from("products").delete().eq("id", id);
  if (error){
    alert("Couldn't delete: " + error.message);
    return;
  }
  loadProductList();
}

async function handleReviewFiles(fileList){
  const files = Array.from(fileList);
  for (const file of files){
    const placeholder = document.createElement("div");
    placeholder.className = "image-thumb uploading";
    placeholder.textContent = "Uploading…";
    document.getElementById("reviewThumbs").appendChild(placeholder);

    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const id = "rv-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
      const path = `reviews/${id}.${ext}`;
      const { error: uploadError } = await supabaseClient.storage
        .from("product-images")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: pub } = supabaseClient.storage.from("product-images").getPublicUrl(path);
      const { error: insertError } = await supabaseClient.from("reviews").insert({
        id, image_url: pub.publicUrl, sort_order: Date.now()
      });
      if (insertError) throw insertError;

      placeholder.remove();
      loadReviewList();
    } catch (err){
      alert("Review upload failed: " + err.message + (err.message && err.message.includes("relation") ? "\n\nMake sure you've run sql/migration-add-reviews.sql in Supabase." : ""));
      placeholder.remove();
    }
  }
}

async function deleteReview(id){
  if (!confirm("Delete this review screenshot? This can't be undone.")) return;
  const { error } = await supabaseClient.from("reviews").delete().eq("id", id);
  if (error){
    alert("Couldn't delete: " + error.message);
    return;
  }
  loadReviewList();
}

/* ---- Product Reviews moderation (real customer star ratings) ---- */
async function loadProductReviewsModeration(){
  if (typeof ProductReviewsService === "undefined") return;
  const [reviews, products] = await Promise.all([
    ProductReviewsService.getAllForAdmin(),
    ProductsService.getAll()
  ]);
  const productNames = {};
  products.forEach(p => { productNames[p.id] = p.name; });

  document.getElementById("productReviewCount").textContent = `${reviews.length} item${reviews.length === 1 ? "" : "s"}`;
  const wrap = document.getElementById("productReviewsModQueue");

  if (!reviews.length){
    wrap.innerHTML = `<div class="admin-empty">No reviews submitted yet.</div>`;
    return;
  }

  wrap.innerHTML = reviews.map(r => `
    <div class="review-mod-card ${r.approved ? "approved" : "pending"}" data-id="${r.id}">
      <div class="review-mod-head">
        <strong>${escapeHTML(r.customer_name)}</strong>
        <span class="stars-plain">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
        <span class="review-mod-product">${escapeHTML(productNames[r.product_id] || r.product_id)}</span>
        <span class="review-mod-status">${r.approved ? "Approved" : "Pending"}</span>
      </div>
      ${r.comment ? `<p>${escapeHTML(r.comment)}</p>` : ""}
      <div class="admin-row-actions">
        ${!r.approved ? `<button class="btn btn-primary btn-sm" data-approve="${r.id}">Approve</button>` : ""}
        <button class="btn btn-ghost btn-sm" data-delete-review="${r.id}">Delete</button>
      </div>
    </div>`).join("");

  wrap.querySelectorAll("[data-approve]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await ProductReviewsService.approve(btn.getAttribute("data-approve"));
      loadProductReviewsModeration();
    });
  });
  wrap.querySelectorAll("[data-delete-review]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this review?")) return;
      await ProductReviewsService.remove(btn.getAttribute("data-delete-review"));
      loadProductReviewsModeration();
    });
  });
}

/* ---- Stats ---- */
async function loadStats(){
  ProductsService.invalidateCache();
  const products = await ProductsService.getAll();

  const byViews = [...products].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 8);
  const byFavs = [...products].sort((a, b) => (b.favorite_count || 0) - (a.favorite_count || 0)).slice(0, 8);

  const renderList = (items, countKey, emptyMsg) => {
    const withCounts = items.filter(p => (p[countKey] || 0) > 0);
    if (!withCounts.length) return `<div class="admin-empty">${emptyMsg}</div>`;
    return withCounts.map(p => `
      <div class="stats-row">
        <img src="${p.image_url || 'https://placehold.co/60x60/151923/5B6272?text=—'}" alt="">
        <span class="name">${escapeHTML(p.name)}</span>
        <span class="stat-value">${p[countKey] || 0}</span>
      </div>`).join("");
  };

  document.getElementById("statsMostViewed").innerHTML = renderList(byViews, "view_count", "No views tracked yet.");
  document.getElementById("statsMostFavorited").innerHTML = renderList(byFavs, "favorite_count", "No favorites tracked yet.");
}

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
