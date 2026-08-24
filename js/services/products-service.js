/* ==========================================================================
   PRODUCTS SERVICE
   Every product query goes through here. Today it reads js/data/products.js;
   point these functions at Supabase (or any API) later and nothing else
   in the site needs to change.
   ========================================================================== */

const ProductsService = {

  getAll(){
    return Promise.resolve([...PRODUCTS]);
  },

  getById(id){
    return Promise.resolve(PRODUCTS.find(p => p.id === id) || null);
  },

  getFeatured(limit = 4){
    return Promise.resolve([...PRODUCTS].slice(0, limit));
  },

  getByCondition(condition, limit = 4){
    return Promise.resolve(PRODUCTS.filter(p => p.condition === condition).slice(0, limit));
  },

  getStats(){
    return Promise.resolve({
      total: PRODUCTS.length,
      new: PRODUCTS.filter(p => p.condition === "new").length,
      used: PRODUCTS.filter(p => p.condition === "used").length
    });
  },

  getBrands(){
    const counts = {};
    PRODUCTS.forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    return Promise.resolve(Object.keys(counts).sort().map(brand => ({ brand, count: counts[brand] })));
  },

  /**
   * filters: { condition: [], brand: [], minPrice, maxPrice, search, sort }
   */
  query(filters = {}){
    let results = [...PRODUCTS];

    if (filters.condition && filters.condition.length){
      results = results.filter(p => filters.condition.includes(p.condition));
    }
    if (filters.brand && filters.brand.length){
      results = results.filter(p => filters.brand.includes(p.brand));
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
      default: /* newest first = catalog order, reversed */ results.reverse();
    }

    return Promise.resolve(results);
  }
};
