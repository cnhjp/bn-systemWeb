<template>
    <el-row>
        <el-col :span="20" :offset="2">
            <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                <el-form-item label="序号" prop="sortIndex">
                    <el-input v-model="formModel.sortIndex"></el-input>
                </el-form-item>
                <el-form-item label="用餐地点" prop="title">
                    <el-input v-model="formModel.title"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <div class="el-text--center mt-25px">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm()">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { addMealAddress } from '@/api/meal-manage'

const emits = defineEmits(['close', 'refresh'])

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false,
    },
    id: {
        type: Number,
        default: 1,
    },
    maxSort: {
        type: Number,
        default: 1,
    },
    formData: {
        type: Object,
        default: () => {},
    },
})

const formRef = ref<FormInstance>()
const formModel = ref({
    id: 0,
    sortIndex: 1,
    title: '',
})
const formRules = reactive<FormRules>({
    sortIndex: [{ required: true, message: '请输入序号', trigger: 'blur' }],
    title: [{ required: true, message: '请输入地址', trigger: 'blur' }],
})

function onClose() {
    emits('close')
}

function onConfirm() {
    formRef.value.validate().then((vali) => {
        if (vali) {
            const data = {} as any
            Object.assign(data, props.formData)
            if (!formModel.value.id) {
                data.items.push(formModel.value)
            } else {
                data.items.map((it: any) => {
                    if (it.id == props.id) {
                        it = formModel.value
                    }
                    return it
                })
            }
            addMealAddress(data).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
    })
}
function init() {
    if (props.isEdit) {
        formModel.value = props.formData.items.find((it) => it.id == props.id)
    } else {
        formModel.value.sortIndex = props.maxSort
    }
}
init()
</script>

<style scoped lang="scss"></style>
