export default [
  {
    redirect: "/login",
    component: () => import("@/layout/empty.vue"),
    children: [
      {
        name: "login",
        path: "/login",
        component: () => import("@/views/login/login.vue"),
        meta: {
          title: "登录",
        },
      },
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      title: "404",
    },
  },
  {
    name: "500",
    path: "/500",
    component: () => import("@/views/error/500.vue"),
    meta: {
      title: "500",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
