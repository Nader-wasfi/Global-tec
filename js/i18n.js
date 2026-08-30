/* ==========================================================================
   TEXT STRINGS — English copy used across the site.
   Every element with data-i18n="some.key" gets its text filled in from
   here on load. Other scripts (render-products.js, render-compare.js, ...)
   call t("some.key") to get the same strings for content they build
   dynamically (badges, table labels, etc).

   (This used to back an Arabic/English toggle — that feature was removed,
   so this file now just holds the site's copy in one place.)
   ========================================================================== */

const I18N = {
  en: {
    "nav.home": "Home",
    "nav.allLaptops": "All Laptops",
    "nav.used": "Used",
    "nav.compare": "Compare",
    "nav.favorites": "Favorites",
    "nav.accessories": "Accessories",
    "nav.sell": "Sell Your Laptop",
    "header.search": "Search laptops...",
    "header.toggleTheme": "Toggle light and dark theme",
    "header.compare": "Compare",
    "header.favorites": "Favorites",
    "header.lang": "العربية",

    "category.all": "All Laptops",
    "category.used": "Used",
    "category.accessories": "Accessories",

    "hero.viewDetails": "View Details",

    "home.justIn": "Just In",
    "home.latestArrivals": "Latest Arrivals",
    "home.viewAll": "View All →",
    "home.greatValue": "Great Value",
    "home.certifiedUsed": "Certified Used",
    "home.customerReviews": "Customer Reviews",
    "home.whatPeopleSay": "What People Say",

    "trust.inspected.title": "Inspected Before Listing",
    "trust.inspected.text": "Every laptop is fully checked — hardware, ports, and screen — before it goes up for sale.",
    "trust.battery.title": "Battery Health {n}%+",
    "trust.battery.text": "We test every battery ourselves — never listed below {n}% health.",
    "trust.storage.title": "Storage Health {n}%+",
    "trust.storage.text": "Drives are tested before listing — never sold below {n}% health.",
    "trust.warranty.title": "{n}-Month Warranty",
    "trust.warranty.text": "Every laptop comes with a {n}-month store warranty, no exceptions.",

    "badge.new": "New",
    "badge.used": "Used",
    "badge.out": "Out of stock",
    "badge.save": "Save {n}",
    "stock.in": "In Stock",
    "stock.out": "Out of Stock",

    "card.addCompare": "Add to compare",
    "card.addFavorite": "Add to favorites",
    "card.removeFavorite": "Remove from favorites",
    "card.viewDetails": "View details",

    "products.title": "All Laptops",
    "products.newLaptops": "Brand New Laptops",
    "products.usedLaptops": "Certified Used Laptops",
    "products.accessories": "Accessories",
    "products.searchPrefix": "Search",
    "products.resultsCount": "{n} result{s} found",
    "products.condition": "Condition",
    "products.category": "Category",
    "products.new": "New",
    "products.availability": "Availability",
    "products.inStock": "In Stock",
    "products.outStock": "Out of Stock",
    "products.display": "Display",
    "products.touchScreen": "Touch Screen",
    "products.brand": "Brand",
    "products.ram": "RAM",
    "products.storage": "Storage",
    "products.screenSize": "Screen Size",
    "products.clear": "Clear",
    "products.price": "Price (EGP)",
    "products.applyFilters": "Apply Filters",
    "products.filters": "Filters",
    "products.sortNewest": "Newest First",
    "products.sortPriceAsc": "Price: Low to High",
    "products.sortPriceDesc": "Price: High to Low",
    "products.min": "Min",
    "products.max": "Max",

    "compare.title": "Compare Laptops",
    "compare.subtitle": "Compare up to 3 laptops side by side.",
    "compare.addAnother": "Add another laptop to compare",
    "compare.emptyTitle": "No laptops selected yet",
    "compare.emptyText": "Pick up to 3 laptops below and this table fills in automatically.",
    "compare.price": "Price",
    "compare.condition": "Condition",
    "compare.conditionNew": "Brand New",
    "compare.conditionUsed": "Used — Inspected",
    "compare.processor": "Processor",
    "compare.ram": "RAM",
    "compare.storage": "Storage",
    "compare.gpu": "Graphics",
    "compare.display": "Display",
    "compare.availability": "Availability",
    "compare.inStock": "In stock",
    "compare.outStock": "Out of stock",

    "favorites.title": "Favorites",
    "favorites.subtitle": "Laptops you've saved for later.",
    "favorites.emptyTitle": "No favorites yet",
    "favorites.emptyText": "Tap the heart icon on any laptop to save it here.",
    "favorites.browse": "Browse Laptops",

    "details.condition": "Condition",
    "details.processor": "Processor",
    "details.ram": "RAM",
    "details.storage": "Storage",
    "details.gpu": "Graphics",
    "details.screen": "Screen",
    "details.brand": "Brand",
    "details.display": "Display",
    "details.availability": "Availability",
    "details.warranty": "{n}-Month Warranty",
    "details.inStockShip": "In stock — ships within 24–48h",
    "details.outStock": "Currently out of stock",
    "details.addCompare": "+ Add to Compare",
    "details.addedCompare": "✓ Added to Compare",
    "details.notifyMe": "Notify Me When Available",
    "details.inspectionNote": "Inspected before listing — battery health {b}%+ and storage health {s}%+, guaranteed.",
    "details.noDescription": "No description provided yet.",
    "details.notFoundTitle": "Laptop not found",
    "details.notFoundText": "It may have been sold or the link is outdated.",
    "details.browseAll": "Browse All Laptops",

    "footer.tagline": "Quality laptops with transparent specs and pricing. Compare before you commit.",
    "footer.shop": "Shop",
    "footer.support": "Support",
    "footer.contact": "Contact",
    "footer.contactUs": "Contact Us",
    "footer.warranty": "Warranty Policy",
    "footer.returns": "Return Policy",
    "footer.shipping": "Shipping Info",
    "footer.usedLaptops": "Used Laptops",
    "footer.rights": "© 2026 Global Tech. All rights reserved.",

    "contact.title": "Contact Us",
    "contact.whatsappPrefix": "WhatsApp: ",
    "contact.hours": "Working Hours",
    "contact.beforeMsg": "Before You Message",
    "contact.beforeMsgBefore": "For the fastest answer on a specific laptop's availability or price, send us the product name from our",
    "contact.catalogLink": "catalog",
    "contact.beforeMsgAfter": "— we'll confirm stock and get back to you on WhatsApp within the hour during working times.",

    "policy.warrantyTitle": "Warranty Policy",
    "policy.warranty.newTitle": "New Laptops",
    "policy.warranty.newText": "Every brand-new laptop we sell includes the manufacturer's official warranty, honored through the manufacturer's authorized service centers in Egypt. We'll help you register it and handle the paperwork if you ever need service.",
    "policy.warranty.usedTitle": "Used Laptops",
    "policy.warranty.usedTextBefore": "All used laptops are inspected before listing and come with a Global Tech store warranty covering hardware faults that aren't caused by accidental damage or misuse. Warranty length is listed on each product's page — reach out via",
    "policy.warranty.contactLink": "Contact Us",
    "policy.warranty.usedTextAfter": "if you're not sure what's covered on a specific unit.",
    "policy.warranty.notCoveredTitle": "What's Not Covered",
    "policy.warranty.notCovered1": "Physical damage from drops, spills, or misuse",
    "policy.warranty.notCovered2": "Software issues caused by third-party installs",
    "policy.warranty.notCovered3": "Normal wear and tear (battery degradation, cosmetic marks)",
    "policy.warranty.footer": "This page is a general summary — exact terms are confirmed at the time of purchase.",

    "policy.returnsTitle": "Return Policy",
    "policy.returns.windowTitle": "14-Day Return Window",
    "policy.returns.windowText": "If a laptop isn't right for you, you can return it within 14 days of delivery for a refund or exchange, as long as it's in the same condition it arrived in — with all original accessories and packaging.",
    "policy.returns.howTitle": "How to Start a Return",
    "policy.returns.how1Before": "Message us on",
    "policy.returns.whatsappLink": "WhatsApp",
    "policy.returns.how1After": "with your order details",
    "policy.returns.how2": "We'll confirm eligibility and arrange pickup or drop-off",
    "policy.returns.how3": "Refunds are processed after inspection, usually within 3–5 business days",
    "policy.returns.nonReturnTitle": "Non-Returnable Cases",
    "policy.returns.nonReturnText": "Laptops with physical damage, missing accessories, or signs of heavy use after delivery may not be eligible for a full refund.",

    "policy.shippingTitle": "Shipping Info",
    "policy.shipping.timesTitle": "Delivery Times",
    "policy.shipping.timesText": "Orders inside Cairo and Giza typically arrive within 1–2 business days. Other governorates usually take 2–4 business days depending on courier coverage.",
    "policy.shipping.costTitle": "Shipping Cost",
    "policy.shipping.costTextBefore": "Delivery fees depend on your location and are confirmed before you pay — nothing is charged automatically. Reach out via",
    "policy.shipping.costTextAfter": "for a quote to your area.",
    "policy.shipping.packagingTitle": "Packaging",
    "policy.shipping.packagingText": "Every laptop ships in protective packaging with the original box where available, plus padded outer packaging for transit.",
    "policy.shipping.trackingTitle": "Tracking Your Order",
    "policy.shipping.trackingText": "Once your order ships, we'll send you the courier's tracking details directly on WhatsApp.",

    "tradein.title": "Sell Your Laptop",
    "tradein.intro": "Have a laptop you're looking to sell or trade in? Fill in what you know about it below — even a rough idea is fine — and we'll send you a fair offer on WhatsApp, usually within the hour during working times.",
    "tradein.brand": "Brand",
    "tradein.model": "Model",
    "tradein.processor": "Processor",
    "tradein.ram": "RAM",
    "tradein.storage": "Storage",
    "tradein.condition": "Condition",
    "tradein.condExcellent": "Excellent — like new",
    "tradein.condGood": "Good — light everyday wear",
    "tradein.condFair": "Fair — noticeable wear, fully working",
    "tradein.condRepair": "Needs repair / has an issue",
    "tradein.price": "Your Expected Price (optional)",
    "tradein.notes": "Anything else we should know? (optional)",
    "tradein.notesPlaceholder": "Battery health, any damage, accessories included, etc.",
    "tradein.submit": "Send via WhatsApp",

    "notfound.title": "This page took a wrong turn",
    "notfound.text": "The page you're looking for doesn't exist — or the laptop may have already been sold. Let's get you back on track.",
    "notfound.home": "Back to Home",
    "notfound.browse": "Browse All Laptops"
  }
};

/* Language is fixed to English — the Arabic/English toggle was removed.
   t("some.key") still works for any code that calls it, it just always
   returns the English string above. */
function t(key, vars){
  let str = (I18N.en && I18N.en[key]) || key;
  if (vars){
    Object.keys(vars).forEach(k => { str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]); });
  }
  return str;
}

function applyI18nDOM(){
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
}

document.addEventListener("DOMContentLoaded", applyI18nDOM);
