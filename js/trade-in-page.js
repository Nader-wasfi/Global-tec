/* ==========================================================================
   LAPTOP FINDER — a short quiz that recommends laptops from the live
   catalog based on the visitor's answers. Matching is done against specs
   using the same automatic use-case classifier (deriveUseCases in utils.js)
   that powers the "Best For" filter and the product page's "Great For"
   section — so nothing needs to be tagged by hand, ever, for this to work
   on new products.
   ========================================================================== */

const FINDER_STEPS = ["usage", "budget", "condition", "screen"];
const finderAnswers = {};
let finderStepIndex = 0;

const BUDGET_RANGES = {
  b1: { min: 0, max: 15000 },
  b2: { min: 15000, max: 25000 },
  b3: { min: 25000, max: 40000 },
  b4: { min: 40000, max: Infinity }
};

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("finderWrap");
  if (!wrap) return;

  const steps = Array.from(wrap.querySelectorAll(".finder-step"));
  const backBtn = document.getElementById("finderBackBtn");
  const nextBtn = document.getElementById("finderNextBtn");
  const progressFill = document.getElementById("finderProgressFill");
  const progressLabel = document.getElementById("finderProgressLabel");
  const tr = typeof t === "function" ? t : (k => k);

  // clicking an option selects it and auto-advances (feels faster than a separate confirm)
  wrap.querySelectorAll(".finder-options").forEach(group => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-value]");
      if (!btn) return;
      const question = group.dataset.question;
      finderAnswers[question] = btn.dataset.value;
      group.querySelectorAll("button").forEach(b => b.classList.toggle("selected", b === btn));
      setTimeout(goNext, 200);
    });
  });

  backBtn.addEventListener("click", () => {
    if (finderStepIndex > 0){ finderStepIndex--; renderStep(); }
  });
  nextBtn.addEventListener("click", goNext);

  function goNext(){
    const currentQuestion = FINDER_STEPS[finderStepIndex];
    if (!finderAnswers[currentQuestion]) return; // require an answer before advancing
    if (finderStepIndex < FINDER_STEPS.length - 1){
      finderStepIndex++;
      renderStep();
    } else {
      showResults();
    }
  }

  function renderStep(){
    steps.forEach((el, i) => el.classList.toggle("active", i === finderStepIndex));
    backBtn.style.visibility = finderStepIndex === 0 ? "hidden" : "visible";
    nextBtn.textContent = finderStepIndex === FINDER_STEPS.length - 1 ? tr("finder.seeResults") : tr("finder.next");
    progressFill.style.width = `${((finderStepIndex + 1) / FINDER_STEPS.length) * 100}%`;
    progressLabel.textContent = tr("finder.step", { n: finderStepIndex + 1, total: FINDER_STEPS.length });
    document.getElementById("finderResults").style.display = "none";
    wrap.querySelectorAll(".finder-nav")[0].style.display = "";
  }

  async function showResults(){
    steps.forEach(el => el.classList.remove("active"));
    wrap.querySelector(".finder-nav").style.display = "none";
    const resultsEl = document.getElementById("finderResults");
    resultsEl.style.display = "";

    const all = await ProductsService.getAll();
    const laptops = all.filter(p => (p.category || "laptop") === "laptop");

    const scored = laptops.map(p => ({ p, score: scoreProduct(p, finderAnswers) }));
    scored.sort((a, b) => b.score - a.score);
    const matches = scored.filter(s => s.score > 0).slice(0, 5).map(s => s.p);

    const grid = document.getElementById("finderResultsGrid");
    if (!matches.length){
      grid.innerHTML = `<p style="color:var(--text-dim); grid-column:1/-1;">${tr("finder.noMatches")}</p>`;
    } else {
      grid.innerHTML = matches.map(productCardHTML).join("");
      bindCompareToggles(grid);
      bindFavoriteToggles(grid);
    }
    resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("finderRestartBtn").addEventListener("click", () => {
    Object.keys(finderAnswers).forEach(k => delete finderAnswers[k]);
    wrap.querySelectorAll(".finder-options button").forEach(b => b.classList.remove("selected"));
    finderStepIndex = 0;
    renderStep();
  });

  renderStep();
});

/* Higher score = better match. 0 or negative means "don't recommend". */
function scoreProduct(p, answers){
  let score = 0;

  // usage — the strongest signal
  if (answers.usage){
    const tags = deriveUseCases(p);
    if (tags.includes(answers.usage)) score += 3;
    else return 0; // doesn't fit the stated use case at all — skip it
  }

  // budget
  if (answers.budget && answers.budget !== "any"){
    const range = BUDGET_RANGES[answers.budget];
    if (range){
      if (p.price >= range.min && p.price <= range.max) score += 2;
      else {
        const distance = p.price < range.min ? range.min - p.price : p.price - range.max;
        score += distance <= range.max * 0.15 ? 0.5 : -1;
      }
    }
  }

  // condition preference
  if (answers.condition && answers.condition !== "any"){
    score += p.condition === answers.condition ? 1 : -0.5;
  }

  // screen size preference
  if (answers.screen && answers.screen !== "any"){
    const size = parseFloat(extractScreenSize(p.screen));
    if (!isNaN(size)){
      const band = size <= 14 ? "small" : size <= 16 ? "medium" : "large";
      score += band === answers.screen ? 1 : -0.3;
    }
  }

  if (!p.in_stock) score -= 2;

  return score;
}
