<template>
    <el-tooltip effect="dark" content="消息通知" :hide-after="0">
        <hover-container class="w-10 h-full">
            <el-badge :value="12" class="important-flex">
                <icon-ep-bell></icon-ep-bell>
            </el-badge>
        </hover-container>
    </el-tooltip>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
