/* ==========================================================================
   RENDER REVIEWS — customer review screenshots, managed from the admin
   panel's Reviews tab. The section stays hidden until at least one review
   has been added.
   ========================================================================== */

async function initReviews(){
  const section = document.getElementById("reviewsSection");
  const track = document.getElementById("reviewsTrack");
  if (!section || !track || typeof ReviewsService === "undefined") return;

  const reviews = await ReviewsService.getAll();
  if (!reviews.length){ section.style.display = "none"; return; }

  track.innerHTML = reviews.map(r =>
    `<div class="review-card"><img src="${r.image_url}" alt="Customer review" loading="lazy"></div>`
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
