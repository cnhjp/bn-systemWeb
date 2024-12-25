<template>
    <!--    <el-dropdown class="h-full" trigger="hover">-->
    <!--        <hover-container class="h-full px-4 outline-none">-->
    <!--            <el-avatar :src="userStore.userInfo.photoURL" :size="32" v-if="userStore.userInfo.photoURL" />-->
    <!--            <IconLocalAvatar class="text-32px" v-else />-->
    <!--            <span class="pl-8px text-14px font-medium el-text&#45;&#45;darkgrey">欢迎您，{{ userStore.userInfo.name }}</span>-->
    <!--        </hover-container>-->
    <!--        <template #dropdown>-->
    <!--            <el-dropdown-menu>-->
    <!--                <el-dropdown-item :icon="UserFilled">用户中心</el-dropdown-item>-->
    <!--                <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--        </template>-->
    <!--    </el-dropdown>-->
    <div class="el-flex is-center-end user-wrapper">
        <div class="h-full px-4 outline-none el-flex is-center">
            <el-avatar :src="userStore.userInfo.photoURL" :size="32" v-if="userStore.userInfo.photoURL" />
            <IconLocalAvatar class="text-32px" v-else />
            <span class="pl-8px text-14px font-medium el-text--darkgrey">欢迎您，{{ userStore.userInfo.name }}</span>
        </div>
        <div @click="onRouter" class="el-border--left px-29px">
            <img src="@/assets/svg/layout-notice.svg" class="icon-btn" />
        </div>
        <div @click="onLogout" class="el-border--left px-29px">
            <img src="@/assets/svg/layout-logout.svg" class="icon-btn" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useUserStore, useRouteStore } from '@/store'
// import { UserFilled } from '@element-plus/icons-vue'
const router = useRouter()
const userStore = useUserStore()
const routeStore = useRouteStore()

const onRouter = () => {
    router.push({ name: 'take-leave-list' })
}
const onLogout = () => {
    userStore.logout()
    routeStore.redirectToLogin()
}
</script>

<style lang="scss">
.user-wrapper {
    > div {
        height: 20px;
        .icon-btn {
            vertical-align: top;
            height: 20px;
            cursor: pointer;
        }
    }
}
</style>
