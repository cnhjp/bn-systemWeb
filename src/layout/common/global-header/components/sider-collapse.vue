<template>
    <hover-container class="w-10 h-full text-18px" @click="appStore.toggleSiderCollapse">
        <icon-local-fold v-if="appStore.siderCollapse"></icon-local-fold>
        <icon-local-expand v-else></icon-local-expand>
    </hover-container>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
