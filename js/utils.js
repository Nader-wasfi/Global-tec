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
