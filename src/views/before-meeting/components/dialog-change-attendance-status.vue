<template>
    <div class="pt-30px px-30px">
        <el-select v-model="status">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="el-flex is-center mt-20px">
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { changeStatus } from '@/api/before-meeting/attendance-manage.ts'
import { ElMessage } from 'element-plus'

defineProps(['list'])
const emits = defineEmits(['close', 'refresh'])

const status = ref<number>(null)

function onClose() {
    emits('close')
}

function onConfirm() {
    if (status.value) {
        changeStatus({ status: status.value }).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    }
}
</script>

<style scoped lang="scss"></style>
