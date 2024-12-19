<template>
    <el-dropdown class="h-full" trigger="hover">
        <hover-container class="h-full px-4 outline-none">
            <el-avatar :src="userStore.userInfo.photoURL" :size="32" v-if="userStore.userInfo.photoURL" />
            <IconLocalAvatar class="text-32px" v-else />
            <span class="pl-8px text-16px font-medium">{{ userStore.userInfo.name }}</span>
        </hover-container>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :icon="UserFilled">用户中心</el-dropdown-item>
                <el-dropdown-item divided @click="onLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script lang="ts" setup>
import { useUserStore, useRouteStore } from '@/store'
import { UserFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const routeStore = useRouteStore()

const onLogout = () => {
    userStore.logout()
    routeStore.redirectToLogin()
}
</script>

<style lang="scss"></style>
