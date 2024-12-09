import { http } from "@/utils/http";

export function login(data) {
  return http.post("/api/login", data);
}

export function getMenu() {
  return http.get("/api/menu");
}
