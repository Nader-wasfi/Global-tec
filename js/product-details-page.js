/* ==========================================================================
   PRODUCT DETAILS PAGE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const root = document.getElementById("detailsRoot");

  const product = id ? await ProductsService.getById(id) : null;

  if (!product){
    root.innerHTML = `<div class="empty-state">
      <h3>Laptop not found</h3>
      <p>It may have been sold or the link is outdated.</p>
      <a href="products.html" class="btn btn-primary">Browse All Laptops</a>
    </div>`;
    return;
  }

  renderProductDetails(product);

  const allProducts = await ProductsService.getAll();
  renderRelatedProducts(product, allProducts);
});
