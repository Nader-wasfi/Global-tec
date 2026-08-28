/* ==========================================================================
   UTILS — small helpers shared across every page.
   ========================================================================== */

function formatEGP(n){
  if (n === null || n === undefined || n === "") return "";
  return new Intl.NumberFormat("en-US").format(n) + " EGP";
}
