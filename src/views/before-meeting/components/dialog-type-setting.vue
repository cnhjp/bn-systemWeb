<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="7em" label-suffix=":">
                <el-form-item label="名称" prop="name"><el-input v-model="formModel.name" /></el-form-item>
                <el-form-item label="排序" prop="sortIndex"><el-input v-model="formModel.sortIndex" /></el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { addTypeSetting, updateTypeSetting } from '~/src/api/before-meeting/info'
const props = defineProps(['conventionTypeId', 'name', 'sortIndex'])

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'refresh'])

const formModel = reactive({
    conventionTypeId: props.conventionTypeId || 0,
    name: props.name,
    sortIndex: props.sortIndex,
    tenantId: 0,
})

const formRules = reactive({
    name: { required: true, message: '请输入名称' },
    sortIndex: { required: true, message: '请输入排序' },
})

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        const api = formModel.conventionTypeId ? updateTypeSetting : addTypeSetting
        const formData = new FormData()
        formData.append('name', formModel.name)
        formData.append('sortIndex', formModel.sortIndex)
        formData.append('conventionTypeId', formModel.conventionTypeId)
        formData.append('tenantId', formModel.tenantId as any)
        api(formData).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}
</script>
