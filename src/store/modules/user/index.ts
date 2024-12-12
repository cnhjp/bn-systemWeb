import { defineStore } from 'pinia'
import { fetchLogin, fetchUserInfo } from '@/api/user/user.ts'
import { getToken, setToken, removeToken } from './helper'
import { applyDefaults } from '@/utils'
import { useRouteStore } from '../route'

export interface UserStoreState {
    /** 用户令牌 */
    token: string
    /** 用户信息 */
    userInfo: User.UserInfo
}

const defaultUserInfo: User.UserInfo = {
    userId: 0,
    userName: '',
    userRole: 'guest',
}

export const useUserStore = defineStore('user-store', {
    state: (): UserStoreState => {
        return {
            token: getToken(),
            userInfo: defaultUserInfo,
        }
    },
    getters: {
        isLoggedIn(state) {
            return Boolean(state.token)
        },
        isInitUser(state) {
            return state.userInfo && state.userInfo.userId > 0
        },
    },
    actions: {
        /** 通过账号密码登录 */
        async login(userName: string, password: string) {
            const query = {
                userName: userName,
                password: password,
                source: 1,
                clientID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            }
            fetchLogin(query).then(async (response) => {
                if (response) {
                    const { info } = response.data
                    await this.initUserStore()
                    setToken(info.token)
                }
            })
        },
        /** 处理登陆成功或失败的逻辑 */
        async handleActionAfterLogin() {
            const route = useRouteStore()

            await this.initUserStore()
            await route.initAuthRoute()
        },
        /** 初始化用户信息 */
        async initUserStore() {
            if (this.isLoggedIn) {
                const { data } = await fetchUserInfo()
                this.userInfo = applyDefaults(data, defaultUserInfo)
            }
        },
        /** 登出并清除用户信息 */
        logout() {
            this.resetUserStore()
        },
        /** 重置用户信息 */
        resetUserStore() {
            removeToken()
            this.$reset()

            const routeStore = useRouteStore()
            routeStore.resetRouteStore()
        },
    },
})
