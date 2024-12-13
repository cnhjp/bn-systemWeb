import type { RouteComponent } from 'vue-router'

export const views: Record<string, RouteComponent> = {
    error_403: () => import('./_builtin/403'),
    error_404: () => import('./_builtin/404'),
    error_500: () => import('./_builtin/500'),
    notFound: () => import('./_builtin/not-found'),
    login: () => import('./_builtin/login'),
    home: () => import('./home'),
}
