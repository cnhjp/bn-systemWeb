import { createRouter, createWebHistory } from "vue-router";
import constantRoutes from "./constant";

const moduleRoutes = [];
// 读取模块路由
const modules = import.meta.glob("./modules/*.js", { eager: true });
for (const path in modules) {
  const module = modules[path].default;
  console.log(module, 9090);
  Array.isArray(module)
    ? moduleRoutes.push(...module)
    : moduleRoutes.push(module);
}

const routes = [...moduleRoutes, ...constantRoutes];

export const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes,
});
