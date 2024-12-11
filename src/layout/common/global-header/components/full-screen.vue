<template>
    <el-tooltip effect="dark" content="全屏" :hide-after="0">
        <hover-container class="w-10 h-full" @click="toggle">
            <icon-ep-full-screen></icon-ep-full-screen>
        </hover-container>
    </el-tooltip>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

const { toggle } = useFullscreen()
</script>

<style lang="scss" scoped></style>
