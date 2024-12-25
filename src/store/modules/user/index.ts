import { defineStore } from 'pinia'
import { fetchLogin, fetchUserInfo, getNoticeTotal } from '@/api/user/user.ts'
import {
    getToken,
    setToken,
    removeToken,
    getClientID,
    setClientID,
    getPersonID,
    setPersonID,
    removePersonID,
    removeClientID,
} from './helper'
import { applyDefaults } from '@/utils'
import { useRouteStore } from '../route'

export interface UserStoreState {
    /** 用户令牌 */
    token: string
    /** 用户信息 */
    userInfo: User.UserInfo
    clientID: string
    personId: string
    noticePopFlag: boolean
    noticeCount: number
}

const defaultUserInfo: User.UserInfo = {
    userId: 0,
    userName: '',
    userRole: 'guest',
    name: '',
    photoURL: '',
    personID: 0,
    noticeCount: 0,
}

export const useUserStore = defineStore('user-store', {
    state: (): UserStoreState => {
        return {
            token: getToken(),
            userInfo: defaultUserInfo,
            clientID: getClientID(),
            personId: getPersonID(),
            noticePopFlag: false,
        }
    },
    getters: {
        isLoggedIn(state) {
            return Boolean(state.token) && !!state.personId
        },
        isInitUser(state) {
            return state.userInfo && state.userInfo.userId > 0
        },
    },
    actions: {
        getGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0
                const v = c == 'x' ? r : (r & 0x3) | 0x8
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
            return fetchLogin(query).then(async (response) => {
                if (response) {
                    const { info } = response.data
                    this.token = `${info?.token_type} ${info?.token}`
                    setToken(this.token)
                    this.personId = info.personId.toString()
                    setPersonID(info.personId.toString())
                    await this.initUserStore()
                }
                return response
            })
        },
        /** 处理登录成功或失败的逻辑 */
        async handleActionAfterLogin() {
            const route = useRouteStore()
            await this.initUserStore()
            await route.initAuthRoute()
        },
        /** 初始化用户信息 */
        async initUserStore() {
            const { data } = await fetchUserInfo(this.personId)
            this.userInfo = applyDefaults(data, defaultUserInfo)
        },
        /** 登出并清除用户信息 */
        logout() {
            this.resetUserStore()
        },
        /** 重置用户信息 */
        resetUserStore() {
            removeToken()
            removePersonID()
            removeClientID()
            this.$reset()

            const routeStore = useRouteStore()
            routeStore.resetRouteStore()
        },
        /** 获取通知 */
        async getNoticeCount() {
            const { data } = await getNoticeTotal()
            this.noticeCount = data || 0
        },
        /** 标记通知弹窗已打开 */
        async flagNoticePop() {
            this.noticePopFlag = true
        },
    },
})
