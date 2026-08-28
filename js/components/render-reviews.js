/* ==========================================================================
   RENDER REVIEWS — customer review screenshots, dropped into images/reviews/
   as review-1.jpg, review-2.jpg, etc (jpg or png). Missing files are skipped
   silently; the whole section stays hidden until at least one image exists.
   ========================================================================== */

const REVIEWS_MAX = 12;

function tryLoadReview(i){
  return new Promise(resolve => {
    const tryExt = (ext, isRetry) => {
      const img = new Image();
      img.onload = () => resolve(`images/reviews/review-${i}.${ext}`);
      img.onerror = () => {
        if (!isRetry) tryExt("png", true);
        else resolve(null);
      };
      img.src = `images/reviews/review-${i}.${ext}`;
    };
    tryExt("jpg", false);
  });
}

async function initReviews(){
  const section = document.getElementById("reviewsSection");
  const track = document.getElementById("reviewsTrack");
  if (!section || !track) return;

  const attempts = [];
  for (let i = 1; i <= REVIEWS_MAX; i++) attempts.push(tryLoadReview(i));
  const sources = (await Promise.all(attempts)).filter(Boolean);

  if (!sources.length) return; // stays hidden — nothing dropped in images/reviews/ yet

  track.innerHTML = sources.map(src =>
    `<div class="review-card"><img src="${src}" alt="Customer review" loading="lazy"></div>`
  ).join("");

  track.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", () => openReviewLightbox(img.src));
  });

  section.style.display = "";
}

function openReviewLightbox(src){
  const overlay = document.createElement("div");
  overlay.className = "review-lightbox";
  overlay.innerHTML = `<img src="${src}" alt="Customer review">`;
  overlay.addEventListener("click", () => overlay.remove());
  document.addEventListener("keydown", function esc(e){
    if (e.key === "Escape"){ overlay.remove(); document.removeEventListener("keydown", esc); }
  });
  document.body.appendChild(overlay);
}

document.addEventListener("DOMContentLoaded", initReviews);
