/* ==========================================================================
   SHARED UI — runs on every page: mobile nav toggle, live compare badge,
   header search (Enter -> products.html?search=...)
   ========================================================================== */

function initSharedUI(){
  // mobile nav
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav){
    navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  }

  // compare badge count, kept live across tabs/pages
  const updateBadge = () => {
    const el = document.getElementById("compareCount");
    if (el) el.textContent = CompareStore.getIds().length;
  };
  updateBadge();
  document.addEventListener("compare:changed", updateBadge);

  // header search
  const headerSearch = document.getElementById("headerSearch");
  if (headerSearch){
    headerSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && headerSearch.value.trim()){
        window.location.href = "products.html?search=" + encodeURIComponent(headerSearch.value.trim());
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initSharedUI);
