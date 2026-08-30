/* ==========================================================================
   FAVORITES PAGE CONTROLLER
   ========================================================================== */

async function loadFavoritesPage(){
  const all = await ProductsService.getAll();
  const ids = FavoritesStore.getIds();
  const items = ids.map(id => all.find(p => p.id === id)).filter(Boolean);

  const grid = document.getElementById("favoritesGrid");
  const empty = document.getElementById("favoritesEmpty");

  if (!items.length){
    grid.style.display = "none";
    empty.style.display = "";
    return;
  }

  grid.style.display = "";
  empty.style.display = "none";
  renderProductGrid("favoritesGrid", items);
}

document.addEventListener("DOMContentLoaded", loadFavoritesPage);
document.addEventListener("favorites:changed", loadFavoritesPage);
