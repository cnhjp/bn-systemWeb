<template>
    <div class="wh-full flex-col-center gap-2em overflow-hidden">
        <div class="flex text-40vmin">
            <IconLocalNoPermission v-if="type === '403'"></IconLocalNoPermission>
            <IconLocalNotFound v-if="type === '404'"></IconLocalNotFound>
            <IconLocalServiceError v-if="type === '500'"></IconLocalServiceError>
            <IconLocalNetworkError v-if="type === 'no-network'"></IconLocalNetworkError>
        </div>
        <router-link :to="{ name: routeHome }">
            <el-button type="primary">回到首页</el-button>
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { routeName } from '@/router'

defineOptions({ name: 'ExceptionBase' })

type ExceptionType = '403' | '404' | '500' | 'no-network'

defineProps<{
    type: ExceptionType
}>()

const routeHome = ref(routeName('root'))
</script>

<style lang="scss" scoped></style>
