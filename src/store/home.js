import { defineStore } from "pinia";

const homeStore = defineStore("home.store", {
  state: () => ({
    isCollapse: false,
  }),
  actions: {
  }
});

export default homeStore;
