/* ==========================================================================
   UTILS — small helpers shared across every page.
   ========================================================================== */

function formatEGP(n){
  if (n === null || n === undefined || n === "") return "";
  return new Intl.NumberFormat("en-US").format(n) + " EGP";
}

/* ---- spec matching helpers, used by the RAM / Storage / Screen Size filters ----
   Product specs are free-text (e.g. "16GB DDR4", "512GB SSD", "15.6\" FHD"),
   so filtering compares the actual number+unit found in the text rather than
   doing a plain substring match — that way "8GB" doesn't wrongly match "128GB". */

function ramMatches(ramText, wantedSize){
  if (!ramText) return false;
  const wanted = parseInt(wantedSize, 10);
  const match = String(ramText).match(/(\d+)\s*GB/i);
  return !!match && parseInt(match[1], 10) === wanted;
}

function storageMatches(storageText, wantedSize){
  if (!storageText) return false;
  const toGB = (num, unit) => unit.toUpperCase() === "TB" ? num * 1000 : num;

  const wantedMatch = String(wantedSize).match(/(\d+)\s*(GB|TB)/i);
  if (!wantedMatch) return false;
  const wantedGB = toGB(parseInt(wantedMatch[1], 10), wantedMatch[2]);

  const actualMatch = String(storageText).match(/(\d+)\s*(GB|TB)/i);
  if (!actualMatch) return false;
  const actualGB = toGB(parseInt(actualMatch[1], 10), actualMatch[2]);

  return actualGB === wantedGB;
}

function extractScreenSize(screenText){
  if (!screenText) return null;
  const match = String(screenText).match(/(\d+(\.\d+)?)\s*("|inch|in\b|-inch)?/i);
  return match ? match[1] : null;
}

/* Renders a compact star rating, e.g. ★★★★☆ (12). Returns "" if no rating is set,
   so callers can just drop the result in without an extra if-check. */
function renderStars(rating, count){
  if (rating === null || rating === undefined || rating === "") return "";
  const r = Math.round(Number(rating) * 2) / 2; // nearest half star
  let starsHTML = "";
  for (let i = 1; i <= 5; i++){
    if (r >= i) starsHTML += '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>';
    else if (r >= i - 0.5) starsHTML += '<svg viewBox="0 0 24 24" width="14" height="14"><defs><linearGradient id="half-star-grad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent" stop-opacity="0"/></linearGradient></defs><path fill="url(#half-star-grad)" stroke="currentColor" stroke-width="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>';
    else starsHTML += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z"/></svg>';
  }
  const countLabel = count ? ` <span class="rating-count">(${count})</span>` : "";
  return `<span class="star-rating">${starsHTML}${countLabel}</span>`;
}
