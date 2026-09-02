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

/* ==========================================================================
   USE-CASE CLASSIFIER — automatically figures out what a laptop is good
   for, purely from its specs (RAM / processor / GPU / storage text).
   No admin data entry needed: add a laptop with specs filled in and it's
   tagged automatically, everywhere (product card, product page, filters,
   and the Laptop Finder quiz).
   ========================================================================== */

const USE_CASES = {
  office:      { label: "Everyday Use & Browsing", reason: "Handles browsing, email, and everyday office work smoothly." },
  study:       { label: "Studying",                reason: "Comfortable for note-taking, research, and video calls." },
  programming: { label: "Programming & Dev Work",   reason: "Enough power for an IDE, local servers, and multiple tabs at once." },
  gaming:      { label: "Gaming",                   reason: "Has a dedicated graphics card, so current games are playable." },
  creative:    { label: "Photo & Video Editing",    reason: "Strong enough CPU/GPU and RAM for editing photos and video." },
  heavy:       { label: "Heavy Multitasking & Pro Work", reason: "Built to handle demanding, professional-grade workloads." }
};

function extractRamGB(ramText){
  if (!ramText) return null;
  const match = String(ramText).match(/(\d+)\s*GB/i);
  return match ? parseInt(match[1], 10) : null;
}

function extractStorageGB(storageText){
  if (!storageText) return null;
  const match = String(storageText).match(/(\d+)\s*(GB|TB)/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  return match[2].toUpperCase() === "TB" ? num * 1000 : num;
}

function cpuTierOf(processorText){
  const s = String(processorText || "").toLowerCase();
  if (/i9|ryzen 9|m3 max|m3 pro|m2 max|m2 pro|xeon/.test(s)) return "high";
  if (/i7|ryzen 7|m3\b|m2\b/.test(s)) return "upper-mid";
  if (/i5|ryzen 5|m1\b/.test(s)) return "mid";
  if (/i3|ryzen 3|celeron|pentium|athlon/.test(s)) return "low";
  return "mid"; // unknown processor text — assume a safe middle tier
}

function hasDedicatedGPU(gpuText){
  return /rtx|gtx|radeon rx|quadro|arc a\d|mx\d/i.test(String(gpuText || ""));
}

/* Returns an array of use-case keys (from USE_CASES) this product suits,
   ordered strongest-first. Works for any product with specs filled in —
   nothing to configure per-product. */
function deriveUseCases(p){
  if (!p || (p.category && p.category !== "laptop")) return [];

  const ramGB = extractRamGB(p.ram) || 8;
  const tier = cpuTierOf(p.processor);
  const dedicatedGPU = hasDedicatedGPU(p.gpu);
  const tags = [];

  if (ramGB >= 16 && (tier === "upper-mid" || tier === "high")) tags.push("heavy");
  if ((dedicatedGPU || tier === "upper-mid" || tier === "high") && ramGB >= 16) tags.push("creative");
  if (dedicatedGPU && ramGB >= 8) tags.push("gaming");
  if (ramGB >= 8 && tier !== "low") tags.push("programming");
  if (ramGB >= 8) tags.push("study");
  if (!(tier === "low" && ramGB < 8)) tags.push("office"); // nearly everything covers basic office use

  return tags;
}

/* Picks the single most impressive tag, for a compact badge on product cards. */
function primaryUseCase(p){
  const order = ["heavy", "creative", "gaming", "programming", "study", "office"];
  const tags = deriveUseCases(p);
  return order.find(t => tags.includes(t)) || null;
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

/* Shows N skeleton placeholder cards in a product grid while data is
   loading, so the page never looks empty/broken for a moment. Just call
   renderProductGrid() as normal once the real data arrives — it replaces
   the skeletons automatically. */
function showSkeletonGrid(containerId, count){
  const el = document.getElementById(containerId);
  if (!el) return;
  count = count || 4;
  el.innerHTML = Array.from({length: count}).map(() => `
    <div class="product-card skeleton-card">
      <div class="skeleton-block skeleton-media"></div>
      <div class="skeleton-body">
        <div class="skeleton-block skeleton-line" style="width:40%;"></div>
        <div class="skeleton-block skeleton-line" style="width:80%; height:16px;"></div>
        <div class="skeleton-block skeleton-line" style="width:60%;"></div>
      </div>
    </div>`).join("");
}
