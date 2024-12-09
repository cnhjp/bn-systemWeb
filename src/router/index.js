import { router } from "./router";
import "./permission";

export function setupRouter(app) {
  app.use(router);
}

export { router };
