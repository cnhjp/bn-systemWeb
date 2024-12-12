import type { RouteComponent } from 'vue-router'

export const views: Record<string, RouteComponent> = {
    error_403: () => import('./_builtin/403'),
    error_404: () => import('./_builtin/404'),
    error_500: () => import('./_builtin/500'),
    notFound: () => import('./_builtin/not-found'),
    login: () => import('./_builtin/login'),
    home: () => import('./home'),
    about: () => import('./about'),
    advice_register: () => import('./proposal').then((m) => m.AdviceRegister),
    motion_register: () => import('./proposal').then((m) => m.MotionRegister),
    proposal_search: () => import('./proposal').then((m) => m.ProposalSearch),
    proposal_detail: () => import('./proposal').then((m) => m.ProposalSearch),
    support_area: () => import('./support').then((m) => m.Area),
    support_term: () => import('./support').then((m) => m.Term),
    support_logger: () => import('./support').then((m) => m.Logger),
    personnel_manage: () => import('./system-setting').then((m) => m.personnelManage),
    params_setting: () => import('./system-setting').then((m) => m.paramsSetting),
}
