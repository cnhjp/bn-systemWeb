<template>
    <div class="el-flex is-align-center" :class="{ noBottom: noBottom }">
        <el-button size="small" icon="ArrowLeft" :underline="false" @click="onBack" class="btn-back" v-if="isShowBtn">
            返回
        </el-button>
        <div class="el-flex is-center">
            <h2>{{ title }}</h2>
            <slot></slot>
        </div>
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
