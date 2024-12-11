<template>
    <router-link :to="{ name: 'home' }" class="layout-logo flex-center w-full nowrap-hidden text-primary font-bold">
        <icon-ep-chrome-filled class="text-32px"></icon-ep-chrome-filled>
        <div v-show="showTitle" class="text-16px p-2">Jarvis管理系统</div>
    </router-link>
</template>

<script lang="ts" setup>
interface Props {
    showTitle: boolean
}

defineProps<Props>()
</script>

<style lang="scss" scoped></style>
