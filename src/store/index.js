export const store = createPinia();

export function setupStore(app) {
  app.use(store);
}
