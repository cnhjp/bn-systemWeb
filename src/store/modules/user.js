import { login, getMenu } from "@/api/user";
import { storage } from "@/utils/storage";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: "",
      menus: [],
    };
  },
  getters: {},
  actions: {
    login(data) {
      return login(data).then(({ data }) => {
        const { token } = data;
        if (token) {
          this.token = token;
          storage.setItem("token", token);
          return this.getMenu();
        }
      });
    },
    logout() {
      return Promise.resolve(() => {
        this.token = "";
        storage.removeItem("token");
      });
    },
    getMenu() {
      return getMenu().then(({ data }) => {
        this.menus = data;
      });
    },
  },
});
