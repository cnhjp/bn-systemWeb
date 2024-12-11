<template>
    <div class="transition-all-300 flex-row items-center justify-between flex-shrink-0 h-full">
        <SiderCollapse></SiderCollapse>
        <div class="flex-center h-full">
            <UserAvatar></UserAvatar>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UserAvatar from './components/user-avatar.vue'
import SiderCollapse from './components/sider-collapse.vue'
</script>

<style lang="scss" scoped></style>
