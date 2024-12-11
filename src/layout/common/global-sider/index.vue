<template>
    <div class="flex-col h-full">
        <GlobalLogo :show-title="!appStore.siderCollapse"></GlobalLogo>
        <VerticalSider :collapse="appStore.siderCollapse"></VerticalSider>
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import { GlobalLogo } from '@/layout/common'
import VerticalSider from './components/vertical-sider.vue'

const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
