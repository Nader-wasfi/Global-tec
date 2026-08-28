/* ==========================================================================
   TRADE-IN PAGE CONTROLLER — builds a WhatsApp message from the form fields.
   No backend involved; this only assembles a wa.me link and opens it.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tradeInForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (typeof SITE_INFO === "undefined") return;

    const brand = document.getElementById("tiBrand").value.trim();
    const model = document.getElementById("tiModel").value.trim();
    const processor = document.getElementById("tiProcessor").value.trim();
    const ram = document.getElementById("tiRam").value.trim();
    const storage = document.getElementById("tiStorage").value.trim();
    const condition = document.getElementById("tiCondition").value;
    const price = document.getElementById("tiPrice").value.trim();
    const notes = document.getElementById("tiNotes").value.trim();

    const lines = [
      "Hi Global Tec, I'd like to sell/trade in a laptop:",
      `Brand: ${brand}`,
      `Model: ${model}`
    ];
    if (processor) lines.push(`Processor: ${processor}`);
    if (ram) lines.push(`RAM: ${ram}`);
    if (storage) lines.push(`Storage: ${storage}`);
    lines.push(`Condition: ${condition}`);
    if (price) lines.push(`Expected price: ${price}`);
    if (notes) lines.push(`Notes: ${notes}`);

    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${SITE_INFO.whatsappNumber}?text=${msg}`, "_blank");
  });
});
