export const useCacheStore = defineStore("cache", {
  state: () => {
    return {
      cacheList: ["list"],
    };
  },
  getters: {},
  actions: {
    keepCache(name) {
      this.cacheList.push(name);
    },
    removeCache(name) {
      this.cacheList = this.cacheList.filter((item) => item !== name);
    },
  },
});
