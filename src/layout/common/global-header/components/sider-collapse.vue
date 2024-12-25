<template>
    <div class="el-flex is-center-start">
        <hover-container class="w-10 h-full text-18px" @click="appStore.toggleSiderCollapse">
            <icon-local-fold v-if="appStore.siderCollapse"></icon-local-fold>
            <icon-local-expand v-else></icon-local-expand>
        </hover-container>
        <h1 class="el-text--darkgrey p-2">{{ title }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import { wrapperEnv } from '@/utils'
const appStore = useAppStore()
const title = ref<string>('智慧会务')
const viteEnv = wrapperEnv()
title.value = viteEnv.VITE_APP_TITLE
</script>

<style lang="scss" scoped>
.el-flex {
    height: 100%;
}
</style>
