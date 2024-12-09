import { Application } from "hztech-core";
import { ElLoading, ElMessage } from "element-plus";

class CommonApp extends Application {
  constructor() {
    super();
    this.ready(() => {
      this.prop("loading", ElLoading);
      this.prop("message", ElMessage);
    });
  }
}

export const commonApp = new CommonApp();
