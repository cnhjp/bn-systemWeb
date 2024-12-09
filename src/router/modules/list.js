const routes = [
  {
    name: "list",
    path: "index",
    component: () => import("@/views/list/list.vue"),
    meta: {
      title: "列表",
    },
  },
  {
    name: "detail",
    path: "detail/:id?",
    component: () => import("@/views/list/detail.vue"),
    meta: {
      title: "详情",
    },
  },
];

export default [
  {
    path: "/list",
    redirect: "/list/index",
    component: () => import("@/layout"),
    children: routes,
  },
];
