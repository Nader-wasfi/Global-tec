/* ==========================================================================
   SHARED UI — runs on every page: mobile nav toggle, live compare badge,
   header search (Enter -> products.html?search=...)
   ========================================================================== */

function initSharedUI(){
  applySiteInfo();

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

  // favorites badge count, kept live across tabs/pages
  const updateFavBadge = () => {
    const el = document.getElementById("favoritesCount");
    if (el && typeof FavoritesStore !== "undefined") el.textContent = FavoritesStore.getIds().length;
  };
  updateFavBadge();
  document.addEventListener("favorites:changed", updateFavBadge);

  // header search
  const headerSearch = document.getElementById("headerSearch");
  if (headerSearch){
    headerSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && headerSearch.value.trim()){
        window.location.href = "products.html?search=" + encodeURIComponent(headerSearch.value.trim());
      }
    });
  }

  // light/dark theme toggle (initial theme is already applied pre-paint by the inline
  // script in <head> — this just wires the button and keeps it in sync)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle){
    themeToggle.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      if (isLight){
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("globaltec_theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("globaltec_theme", "light");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", initSharedUI);

/* Fills every contact/social element on the page from js/data/site-info.js.
   Runs on every page — elements that don't exist on a given page are skipped. */
function applySiteInfo(){
  if (typeof SITE_INFO === "undefined") return;
  const waHref = "https://wa.me/" + SITE_INFO.whatsappNumber;

  // ---- footer (present on every page) ----
  const fbLink = document.getElementById("footerFacebookLink");
  if (fbLink) fbLink.href = SITE_INFO.facebookUrl;

  const igLink = document.getElementById("footerInstagramLink");
  if (igLink){
    if (SITE_INFO.instagramUrl){ igLink.href = SITE_INFO.instagramUrl; igLink.style.display = ""; }
    else igLink.style.display = "none";
  }

  const waLink = document.getElementById("footerWhatsappLink");
  if (waLink) waLink.href = waHref;

  const waFloat = document.getElementById("whatsappFloat");
  if (waFloat) waFloat.href = waHref;

  const headerCall = document.getElementById("headerCallLink");
  if (headerCall) headerCall.href = "tel:+" + SITE_INFO.phoneNumber;

  const genericWaLink = document.getElementById("returnsWhatsappLink");
  if (genericWaLink) genericWaLink.href = waHref;

  const fAddress = document.getElementById("footerAddress");
  if (fAddress) fAddress.textContent = SITE_INFO.addressLine;

  const fPhone = document.getElementById("footerPhone");
  if (fPhone) fPhone.textContent = SITE_INFO.phoneDisplay;

  const fEmail = document.getElementById("footerEmail");
  if (fEmail) fEmail.textContent = SITE_INFO.email;

  // ---- contact.html only ----
  const tr = typeof t === "function" ? t : (k => k);
  const cWa = document.getElementById("contactWhatsappLink");
  if (cWa){ cWa.href = waHref; cWa.textContent = tr("contact.whatsappPrefix") + SITE_INFO.whatsappDisplay; }

  const cPhone = document.getElementById("contactPhoneLink");
  if (cPhone){ cPhone.href = "tel:+" + SITE_INFO.phoneNumber; cPhone.textContent = SITE_INFO.phoneDisplay; }

  const cEmail = document.getElementById("contactEmailLink");
  if (cEmail){ cEmail.href = "mailto:" + SITE_INFO.email; cEmail.textContent = SITE_INFO.email; }

  const cAddress = document.getElementById("contactAddressText");
  if (cAddress) cAddress.textContent = SITE_INFO.addressLine;

  const mapEmbed = document.getElementById("contactMapEmbed");
  if (mapEmbed) mapEmbed.src = "https://www.google.com/maps?q=" + encodeURIComponent(SITE_INFO.addressLine) + "&output=embed";

  const cHours1 = document.getElementById("contactHours1");
  if (cHours1) cHours1.textContent = SITE_INFO.hoursLine1;

  const cHours2 = document.getElementById("contactHours2");
  if (cHours2) cHours2.textContent = SITE_INFO.hoursLine2;
}