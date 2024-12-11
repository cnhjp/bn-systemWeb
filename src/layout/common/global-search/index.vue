<template>
    <el-tooltip effect="dark" content="搜索" :hide-after="0">
        <hover-container class="w-10 h-full" @click="onClick">
            <icon-ep-search />
        </hover-container>
    </el-tooltip>
</template>

<script lang="ts" setup>
const onClick = () => {
    ElMessage({
        message: '搜索功能正在开发中',
        type: 'warning',
    })
}
</script>

<style lang="scss" scoped></style>
