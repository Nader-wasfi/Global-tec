/* ==========================================================================
   REVIEWS SERVICE — customer review screenshots, managed from the admin
   panel (Reviews tab). Backed by the "reviews" table + the existing
   product-images storage bucket (uploaded under a reviews/ path).
   ========================================================================== */

let _reviewsCache = null;

const ReviewsService = {

  invalidateCache(){
    _reviewsCache = null;
  },

  async getAll(){
    if (_reviewsCache) return _reviewsCache;

    if (typeof supabaseClient === "undefined"){
      console.error("Supabase is not configured — check js/data/supabase-config.js");
      return [];
    }

    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error){
      // table probably doesn't exist yet — run sql/migration-add-reviews.sql
      console.warn("Reviews not loaded:", error.message);
      return [];
    }

    _reviewsCache = data || [];
    return _reviewsCache;
  }
};
