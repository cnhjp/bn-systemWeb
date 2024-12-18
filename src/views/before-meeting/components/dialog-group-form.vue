<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="7em" label-suffix=":">
                <el-form-item label="名称" prop="title"><el-input v-model="formModel.title" /></el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        v-model="formModel.startTime"
                        type="datetime"
                        value-format="YYYY-MM-DDTHH:mm:ss"
                        class="!w-full"
                    />
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        v-model="formModel.endTime"
                        type="datetime"
                        value-format="YYYY-MM-DDTHH:mm:ss"
                        class="!w-full"
                    />
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { addGroup, updateGroup } from '~/src/api/before-meeting/info'
const props = defineProps(['id', 'title', 'startTime', 'endTime'])

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'refresh'])

const formModel = reactive({
    id: props.id,
    title: props.title,
    startTime: props.startTime,
    endTime: props.endTime,
})

const formRules = reactive({
    title: { required: true, message: '请输入会议名称' },
    startTime: { required: true, message: '请选择开始时间' },
    endTime: { required: true, message: '请选择结束时间' },
})

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        const api = formModel.id ? updateGroup : addGroup
        api(formModel).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}
</script>
