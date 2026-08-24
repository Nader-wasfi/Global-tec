/* ==========================================================================
   COMPARE PAGE CONTROLLER
   ========================================================================== */

async function loadComparePage(){
  const all = await ProductsService.getAll();
  const selectedIds = CompareStore.getIds();
  const selected = selectedIds.map(id => all.find(p => p.id === id)).filter(Boolean);

  renderCompareTable(selected);

  const picker = document.getElementById("comparePicker");
  if (selected.length >= CompareStore.MAX){
    picker.style.display = "none";
  } else {
    picker.style.display = "";
    const remaining = all.filter(p => !selectedIds.includes(p.id));
    renderProductGrid("pickerGrid", remaining);
  }
}

document.addEventListener("DOMContentLoaded", loadComparePage);
document.addEventListener("compare:changed", loadComparePage);
