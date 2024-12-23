<template>
    <div class="p-20px">
        <el-radio-group v-model="arrangeType">
            <el-radio :value="1" size="large">未安排房间人员</el-radio>
            <el-radio :value="2" size="large">所有人员</el-radio>
        </el-radio-group>
        <div class="el-flex is-center mt-20px">
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { setArrange } from '@/api/accommodation-manage'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'refresh'])

const arrangeType = ref<number>(1)
const props = defineProps(['conventionId'])

function onClose() {
    emits('close')
}

function onConfirm() {
    const data = {
        arrangeType: arrangeType.value,
        conventionId: props.conventionId,
    }
    setArrange(data).then(() => {
        ElMessage.success('操作成功')
        emits('refresh')
        emits('close')
    })
}
</script>
