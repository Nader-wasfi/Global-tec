/* ==========================================================================
   RECENTLY VIEWED STORE — remembers the last few products this visitor
   looked at, purely in their own browser (no account needed).
   ========================================================================== */

const RecentlyViewedStore = {
  KEY: "globaltec_recently_viewed",
  MAX: 8,

  getIds(){
    try{
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){ return []; }
  },

  add(id){
    let ids = this.getIds().filter(x => x !== id);
    ids.unshift(id);
    ids = ids.slice(0, this.MAX);
    try{ localStorage.setItem(this.KEY, JSON.stringify(ids)); }catch(e){}
  }
};
