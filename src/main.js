import { createApp } from "vue";
import "virtual:uno.css";
import "./style.scss";
import App from "./App.vue";
import { commonApp } from "./utils/commonApp";
import { setupRouter } from "./router";
import { setupStore } from "./store";
import { setupNetworkCheck } from "@/utils/network-check";

// 项目启动
commonApp.ready(() => {
  // 检测网络掉线
  setupNetworkCheck();
  // vue app
  const app = createApp(App);
  setupRouter(app);
  setupStore(app);
  app.mount("#app");
  commonApp.prop("vue", app);
  window.$app = commonApp;
});

commonApp.bootstrap({});
