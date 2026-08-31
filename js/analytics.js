/* ==========================================================================
   GOOGLE ANALYTICS — fill in your GA4 Measurement ID below (looks like
   "G-XXXXXXXXXX", from analytics.google.com → Admin → Data Streams) and it
   will start tracking automatically on every page. Leave it blank to keep
   analytics off — nothing loads or errors either way.
   ========================================================================== */

const GA_MEASUREMENT_ID = "G-MFM8ZLYX2G"; 

(function(){
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
})();
