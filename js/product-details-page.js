/* ==========================================================================
   PRODUCT DETAILS PAGE CONTROLLER
   ========================================================================== */

let _currentDetailsProduct = null;
let _currentDetailsAllProducts = null;

async function loadProductDetailsPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const root = document.getElementById("detailsRoot");

  const product = id ? await ProductsService.getById(id) : null;

  if (!product){
    const tr = typeof t === "function" ? t : (k => k);
    root.innerHTML = `<div class="empty-state">
      <h3>${tr("details.notFoundTitle")}</h3>
      <p>${tr("details.notFoundText")}</p>
      <a href="products.html" class="btn btn-primary">${tr("details.browseAll")}</a>
    </div>`;
    return;
  }

  _currentDetailsProduct = product;
  renderProductDetails(product);

  _currentDetailsAllProducts = await ProductsService.getAll();
  renderRelatedProducts(product, _currentDetailsAllProducts);
}

document.addEventListener("DOMContentLoaded", loadProductDetailsPage);
