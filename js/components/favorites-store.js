/* ==========================================================================
   FAVORITES STORE — tracks which product ids the visitor has saved.
   Persisted in the visitor's browser (localStorage). No limit.
   ========================================================================== */

const FavoritesStore = {
  KEY: "globaltec_favorites",

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
    if (ids.includes(id)) return ids;
    ids.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    this._notify();
    return ids;
  },

  remove(id){
    const ids = this.getIds().filter(x => x !== id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    this._notify();
    return ids;
  },

  toggle(id){
    return this.has(id) ? this.remove(id) : this.add(id);
  },

  clear(){
    localStorage.removeItem(this.KEY);
    this._notify();
  },

  _notify(){
    document.dispatchEvent(new CustomEvent("favorites:changed", { detail:{ ids:this.getIds() } }));
  }
};
