<template>
    <div v-loading="appStore.loading" class="h-full">
        <router-view></router-view>
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
