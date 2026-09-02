/* ==========================================================================
   PRODUCTS SERVICE
   Every product query goes through here — now backed by Supabase. Fetches
   the full catalog once per page load and caches it in memory; every
   method below filters/sorts that cache, so this stays fast even with
   many products. Call ProductsService.invalidateCache() after an
   admin panel write so the next read re-fetches fresh data.
   ========================================================================== */

let _productsCache = null;

async function _fetchAllProducts(){
  if (_productsCache) return _productsCache;

  if (typeof supabaseClient === "undefined"){
    console.error("Supabase is not configured — check js/data/supabase-config.js");
    return [];
  }

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error){
    console.error("Failed to load products:", error.message);
    return [];
  }

  _productsCache = data || [];
  return _productsCache;
}

const ProductsService = {

  invalidateCache(){
    _productsCache = null;
  },

  async getAll(){
    const all = await _fetchAllProducts();
    return [...all];
  },

  async getById(id){
    const all = await _fetchAllProducts();
    return all.find(p => p.id === id) || null;
  },

  /* Fire-and-forget view counter — bumps view_count and the "today" count
     via a Postgres function (see sql/migration-add-ratings-and-views.sql).
     Safe to call even before that migration has run: fails silently. */
  async incrementView(id){
    if (typeof supabaseClient === "undefined") return;
    try {
      await supabaseClient.rpc("increment_product_view", { p_id: id });
    } catch (e){
      // migration probably not run yet — not worth surfacing to the visitor
    }
  },

  /* Fire-and-forget favorite counter — lets the admin Stats tab show
     "most favorited" even though the favorites list itself lives in each
     visitor's own browser. delta is +1 (added) or -1 (removed). */
  async adjustFavoriteCount(id, delta){
    if (typeof supabaseClient === "undefined") return;
    try {
      await supabaseClient.rpc("adjust_favorite_count", { p_id: id, p_delta: delta });
    } catch (e){
      // migration probably not run yet — not worth surfacing to the visitor
    }
  },

  async getFeatured(limit = 4){
    const all = await _fetchAllProducts();
    return all.filter(p => (p.category || "laptop") === "laptop").slice(0, limit);
  },

  async getByCondition(condition, limit = 4){
    const all = await _fetchAllProducts();
    return all.filter(p => p.condition === condition && (p.category || "laptop") === "laptop").slice(0, limit);
  },

  async getAccessories(limit){
    const all = await _fetchAllProducts();
    const items = all.filter(p => p.category === "accessory");
    return limit ? items.slice(0, limit) : items;
  },

  async getStats(){
    const all = await _fetchAllProducts();
    return {
      total: all.length,
      new: all.filter(p => p.condition === "new").length,
      used: all.filter(p => p.condition === "used").length
    };
  },

  async getBrands(){
    const all = await _fetchAllProducts();
    const counts = {};
    all.filter(p => (p.category || "laptop") === "laptop").forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Object.keys(counts).sort().map(brand => ({ brand, count: counts[brand] }));
  },

  /**
   * filters: { condition: [], brand: [], category: [], stock: [], touch, minPrice, maxPrice, search, sort }
   * category defaults to ["laptop"] when omitted, so laptop listing pages
   * never mix in accessories unless explicitly asked for.
   */
  async query(filters = {}){
    let results = await _fetchAllProducts();
    results = [...results];

    const categoryFilter = (filters.category && filters.category.length) ? filters.category : ["laptop"];
    results = results.filter(p => categoryFilter.includes(p.category || "laptop"));

    if (filters.condition && filters.condition.length){
      results = results.filter(p => filters.condition.includes(p.condition));
    }
    if (filters.brand && filters.brand.length){
      results = results.filter(p => filters.brand.includes(p.brand));
    }
    if (filters.ram && filters.ram.length){
      results = results.filter(p => filters.ram.some(size => ramMatches(p.ram, size)));
    }
    if (filters.storage && filters.storage.length){
      results = results.filter(p => filters.storage.some(size => storageMatches(p.storage, size)));
    }
    if (filters.screenSize && filters.screenSize.length){
      results = results.filter(p => filters.screenSize.includes(extractScreenSize(p.screen)));
    }
    if (filters.useCase && filters.useCase.length){
      results = results.filter(p => {
        const tags = deriveUseCases(p);
        return filters.useCase.some(tag => tags.includes(tag));
      });
    }
    if (filters.stock && filters.stock.length === 1){
      const wantIn = filters.stock[0] === "in";
      results = results.filter(p => p.in_stock === wantIn);
    }
    if (filters.touch){
      results = results.filter(p => (p.screen || "").toLowerCase().includes("touch"));
    }
    if (filters.minPrice != null && filters.minPrice !== ""){
      results = results.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice != null && filters.maxPrice !== ""){
      results = results.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.search){
      const q = filters.search.trim().toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.processor || "").toLowerCase().includes(q)
      );
    }

    switch (filters.sort){
      case "price_asc": results.sort((a,b) => a.price - b.price); break;
      case "price_desc": results.sort((a,b) => b.price - a.price); break;
      case "popular": results.sort((a,b) => (b.view_count || 0) - (a.view_count || 0)); break;
      default: /* newest first */ break; // already ordered by created_at desc from Supabase
    }

    return results;
  }
};
