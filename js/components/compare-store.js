/* ==========================================================================
   COMPARE STORE — tracks which product ids are selected to compare.
   Persisted in the visitor's browser (localStorage), max 3 items.
   ========================================================================== */

const CompareStore = {
  KEY: "globaltec_compare",
  MAX: 3,

  getIds(){
    try{
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  },

  has(id){
    return this.getIds().includes(id);
  },

  add(id){
    const ids = this.getIds();
    if (ids.includes(id)) return { ok:true, ids };
    if (ids.length >= this.MAX) return { ok:false, reason:"limit", ids };
    ids.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    this._notify();
    return { ok:true, ids };
  },

  remove(id){
    const ids = this.getIds().filter(x => x !== id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    this._notify();
    return ids;
  },

  toggle(id){
    return this.has(id) ? { ok:true, ids:this.remove(id) } : this.add(id);
  },

  clear(){
    localStorage.removeItem(this.KEY);
    this._notify();
  },

  _notify(){
    document.dispatchEvent(new CustomEvent("compare:changed", { detail:{ ids:this.getIds() } }));
  }
};
