import { defineStore } from 'pinia'
import { fetchLogin, fetchUserInfo } from '@/api/user/user.ts'
import { getToken, setToken, removeToken, getClientID, setClientID } from './helper'
import { applyDefaults } from '@/utils'
import { useRouteStore } from '../route'

export interface UserStoreState {
    /** 用户令牌 */
    token: string
    /** 用户信息 */
    userInfo: User.UserInfo
    clientID: string
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
            clientID: getClientID(),
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
        getGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = (Math.random() * 16) | 0
                let v = c == 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            })
        },
        /** 通过账号密码登录 */
        async login(userName: string, password: string) {
            if (!this.clientID) {
                const guid = this.getGuid()
                setClientID(guid)
                this.clientID = guid
            }
            const query = {
                userName: userName,
                password: password,
                source: 1,
                clientID: this.clientID,
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
