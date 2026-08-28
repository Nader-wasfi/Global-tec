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

  async getFeatured(limit = 4){
    const all = await _fetchAllProducts();
    return all.slice(0, limit);
  },

  async getByCondition(condition, limit = 4){
    const all = await _fetchAllProducts();
    return all.filter(p => p.condition === condition).slice(0, limit);
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
    all.forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Object.keys(counts).sort().map(brand => ({ brand, count: counts[brand] }));
  },

  /**
   * filters: { condition: [], brand: [], stock: [], touch, minPrice, maxPrice, search, sort }
   */
  async query(filters = {}){
    let results = await _fetchAllProducts();
    results = [...results];

    if (filters.condition && filters.condition.length){
      results = results.filter(p => filters.condition.includes(p.condition));
    }
    if (filters.brand && filters.brand.length){
      results = results.filter(p => filters.brand.includes(p.brand));
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
      default: /* newest first */ break; // already ordered by created_at desc from Supabase
    }

    return results;
  }
};
