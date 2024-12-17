<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="7em" label-suffix=":">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formModel.name" placeholder="请输入分类名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortIndex">
                    <el-input v-model="formModel.sortIndex" placeholder="请输入排序"></el-input>
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
import { addCategory, updateCategory } from '~/src/api/before-meeting/material'

const props = defineProps(['conventionId', 'maxSortIndex', 'name', 'categoryID', 'sortIndex'])
const emits = defineEmits(['close', 'refresh'])

const formModel = reactive({
    categoryID: props.categoryID || 0,
    conventionId: props.conventionId,
    name: props.name,
    sortIndex: props.sortIndex || props.maxSortIndex,
})
const formRules = reactive({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    sortIndex: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const refForm = ref<any>(null)

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        const api = formModel.categoryID ? updateCategory : addCategory
        api(formModel).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}
</script>
