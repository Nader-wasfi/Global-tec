/* ==========================================================================
   ADMIN PANEL
   Auth-gated CRUD for the products table, with image upload straight to
   the "product-images" Supabase Storage bucket. Relies on the RLS policies
   in sql/schema.sql: only a signed-in user can insert/update/delete.
   ========================================================================== */

let currentImages = [];   // URLs for the product currently being added/edited
let editingId = null;     // null while adding a new product

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

  // ---- modal open/close ----
  document.getElementById("addProductBtn").addEventListener("click", () => openModal());
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("cancelFormBtn").addEventListener("click", closeModal);
  document.getElementById("productModalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "productModalBackdrop") closeModal();
  });

  // ---- image upload ----
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
  const products = await ProductsService.getAll();
  const rowsEl = document.getElementById("productRows");
  document.getElementById("productCount").textContent = `${products.length} item${products.length === 1 ? "" : "s"}`;

  if (!products.length){
    rowsEl.innerHTML = `<div class="admin-empty">No products yet — click "Add New Product" to create your first listing.</div>`;
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
        <button class="btn btn-ghost btn-sm" data-delete="${p.id}">Delete</button>
      </div>
    </div>`).join("");

  rowsEl.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const product = await ProductsService.getById(btn.getAttribute("data-edit"));
      if (product) openModal(product);
    });
  });
  rowsEl.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-delete")));
  });
}

function openModal(product){
  editingId = product ? product.id : null;
  currentImages = product ? [...(product.image_gallery || [])] : [];

  document.getElementById("modalTitle").textContent = product ? "Edit Product" : "Add New Product";
  document.getElementById("pId").value = product ? product.id : makeId();
  document.getElementById("pName").value = product ? product.name : "";
  document.getElementById("pBrand").value = product ? product.brand : "";
  document.getElementById("pCondition").value = product ? product.condition : "used";
  document.getElementById("pPrice").value = product ? product.price : "";
  document.getElementById("pOldPrice").value = product && product.old_price != null ? product.old_price : "";
  document.getElementById("pProcessor").value = product ? (product.processor || "") : "";
  document.getElementById("pRam").value = product ? (product.ram || "") : "";
  document.getElementById("pStorage").value = product ? (product.storage || "") : "";
  document.getElementById("pGpu").value = product ? (product.gpu || "") : "";
  document.getElementById("pScreen").value = product ? (product.screen || "") : "";
  document.getElementById("pDescription").value = product ? (product.description || "") : "";
  document.getElementById("pInStock").checked = product ? !!product.in_stock : true;
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

  const product = {
    id: document.getElementById("pId").value,
    name,
    brand,
    condition: document.getElementById("pCondition").value,
    price,
    old_price: oldPriceRaw === "" ? null : Number(oldPriceRaw),
    processor: document.getElementById("pProcessor").value.trim(),
    ram: document.getElementById("pRam").value.trim(),
    storage: document.getElementById("pStorage").value.trim(),
    gpu: document.getElementById("pGpu").value.trim(),
    screen: document.getElementById("pScreen").value.trim(),
    description: document.getElementById("pDescription").value.trim(),
    image_url: currentImages[0] || "",
    image_gallery: currentImages,
    in_stock: document.getElementById("pInStock").checked
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

function escapeHTML(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
