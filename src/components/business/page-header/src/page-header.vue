<template>
    <div class="c-page-header select-none" :class="{ noBottom: noBottom }">
        <el-button
            size="small"
            icon="icon-operation-return"
            :underline="false"
            @click="onBack"
            class="btn-back"
            v-if="isShowBtn"
        >
            返回
        </el-button>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps({
    title: {
        type: String,
        default: '',
    },
    isShowBtn: {
        type: Boolean,
        default: false,
    },
    noBottom: {
        type: Boolean,
        default: false,
    },
})

const router = useRouter()
function onBack() {
    router.go(-1)
}
</script>

<style scoped lang="scss"></style>
