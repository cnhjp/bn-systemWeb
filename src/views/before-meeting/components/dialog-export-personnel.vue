<template>
    <el-container>
        <el-main>
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                全选
            </el-checkbox>
            <el-checkbox-group v-model="checkedFields" @change="handleCheckedFieldsChange">
                <el-checkbox
                    v-for="field in fields"
                    :key="field.fieldName"
                    :label="field.fieldName"
                    :value="field.fieldName"
                >
                    {{ field.name }}
                </el-checkbox>
            </el-checkbox-group>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { conventionPersonExportField, downloadPersonnel } from '~/src/api/before-meeting/personnel'

const props = defineProps({
    downloadParams: {
        type: Object,
        default: () => ({}),
    },
})

const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedFields = ref<string[]>([])
const fields = ref<any>([])

const handleCheckAllChange = (val: boolean) => {
    checkedFields.value = val ? fields.value.map((f) => f.fieldName) : []
    isIndeterminate.value = false
}

const handleCheckedFieldsChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === fields.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < fields.value.length
}

const emits = defineEmits(['close', 'confirm'])

function onClose() {
    emits('close')
}

function onConfirm() {
    if (checkedFields.value.length === 0) {
        ElMessage.error('请选择导出字段')
        return
    }
    downloadPersonnel({
        ...props.downloadParams,
        exportFields: checkedFields.value,
    })
}

onMounted(() => {
    conventionPersonExportField().then((res) => {
        fields.value.push(...res.data)
    })
})
</script>
