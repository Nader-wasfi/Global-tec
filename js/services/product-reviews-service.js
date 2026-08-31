/* ==========================================================================
   PRODUCT REVIEWS SERVICE — real customer star ratings + comments,
   submitted from the product page, shown only once approved from admin.
   Separate from js/services/reviews-service.js, which handles the
   homepage's review-screenshot carousel.
   ========================================================================== */

const ProductReviewsService = {

  async getApprovedForProduct(productId){
    if (typeof supabaseClient === "undefined") return [];
    const { data, error } = await supabaseClient
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error){ console.warn("Reviews not loaded:", error.message); return []; }
    return data || [];
  },

  /* Average + count of approved reviews for a product — used to show a
     "real" star rating instead of the admin's manually-entered one,
     whenever real reviews exist. */
  async getSummaryForProduct(productId){
    const reviews = await this.getApprovedForProduct(productId);
    if (!reviews.length) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { rating: Math.round(avg * 10) / 10, count: reviews.length };
  },

  async submit(productId, customerName, rating, comment){
    if (typeof supabaseClient === "undefined") throw new Error("Reviews aren't set up yet.");
    const id = "pr-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
    const { error } = await supabaseClient.from("product_reviews").insert({
      id, product_id: productId, customer_name: customerName, rating, comment: comment || null, approved: false
    });
    if (error) throw error;
  },

  /* ---- admin only ---- */
  async getAllForAdmin(){
    if (typeof supabaseClient === "undefined") return [];
    const { data, error } = await supabaseClient
      .from("product_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error){ console.warn("Reviews not loaded:", error.message); return []; }
    return data || [];
  },

  async approve(id){
    const { error } = await supabaseClient.from("product_reviews").update({ approved: true }).eq("id", id);
    if (error) throw error;
  },

  async remove(id){
    const { error } = await supabaseClient.from("product_reviews").delete().eq("id", id);
    if (error) throw error;
  }
};
