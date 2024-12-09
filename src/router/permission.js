import { router } from "./router";
import { changePageTitle } from "@/utils/utils";

router.afterEach((to) => {
  const title = to.meta.title || import.meta.env.VITE_APP_TITLE;
  changePageTitle(title);
});
