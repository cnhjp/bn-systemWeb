<template>
    <div class="pt-30px px-30px">
        <el-select v-model="attendStatus">
            <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="el-flex is-center mt-20px">
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { changeStatus } from '@/api/attendance-manage'
import { ElMessage } from 'element-plus'

const props = defineProps(['list', 'ids', 'attendStatus'])
const emits = defineEmits(['close', 'refresh'])

const attendStatus = ref<number>(props.attendStatus || null)

function onClose() {
    emits('close')
}

function onConfirm() {
    if (attendStatus.value) {
        const query = {
            attendStatus: attendStatus.value,
            conventionPersonIdList: props.ids,
        }
        changeStatus(query).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    }
}
</script>

<style scoped lang="scss"></style>
