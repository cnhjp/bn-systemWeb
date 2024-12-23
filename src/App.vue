<template>
    <el-config-provider :locale="zhCn">
        <div v-loading="appStore.loading" class="h-full">
            <router-view></router-view>
        </div>
    </el-config-provider>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const appStore = useAppStore()
</script>

<style lang="scss" scoped></style>
