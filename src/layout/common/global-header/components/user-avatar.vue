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
        <div @click="onOpenNotification" class="el-border--left px-29px">
            <el-badge class="item" :is-dot="!!userStore.leaveCount || !!userStore.noReplyCount">
                <img src="@/assets/svg/layout-notice.svg" class="icon-btn" />
            </el-badge>
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
import { ElNotification } from 'element-plus'

const onLogout = () => {
    userStore.logout()
    routeStore.redirectToLogin()
}

//消息通知

const onOpenNotification = () => {
    openNotificationLeave()
    setTimeout(() => {
        openNotificationNoReply()
    }, 100)
}

const popLeave = ref<any>(null)
async function openNotificationLeave() {
    popLeave.value = ElNotification({
        title: '请假管理',
        message: `共有${userStore.leaveCount}条请假信息待审批`,
        offset: 50,
        type: 'info',
        onClick: () => {
            router.push({ name: 'take-leave-list' })
        },
    })
}

//更新弹窗
watch(
    () => userStore.leaveCount,
    () => {
        popLeave.value?.close()
        openNotificationLeave()
    },
)

const popNoReply = ref<any>(null)
async function openNotificationNoReply() {
    popNoReply.value = ElNotification({
        title: '在线咨询',
        message: `共有${userStore.noReplyCount}条在线咨询未答复`,
        offset: 50,
        type: 'info',
        onClick: () => {
            router.push({ name: 'online-consultation-list' })
        },
    })
}

//更新弹窗
watch(
    () => userStore.noReplyCount,
    () => {
        popNoReply.value?.close()
        openNotificationNoReply()
    },
)

async function init() {
    await userStore.getLeaveCount()
    await userStore.getNoReplyCount()
}

onMounted(() => {
    init()
})

onBeforeUnmount(() => {
    if (popLeave.value) popLeave.value.close()
})
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
