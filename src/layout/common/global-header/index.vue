<template>
    <div class="transition-all-300 flex-row items-center justify-between flex-shrink-0 h-full">
        <SiderCollapse></SiderCollapse>
        <div class="flex-1">
            <Breadcrumb></Breadcrumb>
        </div>
        <div class="flex-center h-full">
            <GlobalSearch></GlobalSearch>
            <FullScreen></FullScreen>
            <SystemMessage></SystemMessage>
            <UserAvatar></UserAvatar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './components/breadcrumb.vue'
import FullScreen from './components/full-screen.vue'
import SystemMessage from './components/system-message.vue'
import UserAvatar from './components/user-avatar.vue'
import SiderCollapse from './components/sider-collapse.vue'
import GlobalSearch from '../global-search/index.vue'
</script>

<style lang="scss" scoped></style>
