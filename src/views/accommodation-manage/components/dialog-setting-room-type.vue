<template>
    <el-form class="p-30px">
        <el-form-item label="设置房间要求">
            <el-select v-model="roomType">
                <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
    </el-form>
    <div class="el-flex is-center">
        <el-button @click="onClose">取消</el-button>
        <el-button @click="onConfirm" type="primary">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import { settingRoomType } from '@/api/accommodation-manage'
import { ElMessage } from 'element-plus'

const props = defineProps(['list', 'conventionPersonIdList', 'conventionId'])

const emits = defineEmits(['close', 'refresh'])
const roomType = ref<number>(0)

function onClose() {
    emits('close')
}
function onConfirm() {
    const data = {
        conventionPersonIdList: props.conventionPersonIdList,
        conventionId: props.conventionId,
        roomType: Number(roomType.value),
    }
    settingRoomType(data).then(() => {
        ElMessage.success('操作成功')
        emits('refresh')
        emits('close')
    })
}
</script>

<style scoped lang="scss"></style>
