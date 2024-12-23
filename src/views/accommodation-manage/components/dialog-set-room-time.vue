<template>
    <el-row>
        <el-col :span="20" :offset="2">
            <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px">
                <el-form-item label="开始入住时间" prop="checkInStart">
                    <el-date-picker
                        v-model="formModel.checkInStart"
                        type="datetime"
                        placeholder="开始入住时间"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DDTHH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="结束入住时间" prop="checkInEnd">
                    <el-date-picker
                        v-model="formModel.checkInEnd"
                        type="datetime"
                        placeholder="结束入住时间"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DDTHH:mm:ss"
                    />
                </el-form-item>
            </el-form>
            <div class="el-text--center mt-25px">
                <el-button @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm()">确定</el-button>
            </div>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { detailTimeConfig, setTimeConfig } from '@/api/accommodation-manage'

const props = defineProps(['conventionId'])
const emits = defineEmits(['close', 'refresh'])

const formRef = ref<FormInstance>()
const formModel = ref<any>({
    id: 0,
    checkInTime: null,
    checkInStart: null,
    checkInEnd: null,
})
const checkStartTime = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请填写开始入住时间')
    } else {
        const startTime = new Date(value)
        const endTime = new Date(formModel.value.checkInEnd)
        if (formModel.value.checkInEnd && startTime > endTime) {
            formModel.value.checkInStart = null
            return callback('开始入住时间不能大于结束入住时间')
        } else {
            return callback()
        }
    }
}
const checkEndTime = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请填写结束入住时间')
    } else {
        const startTime = new Date(formModel.value.checkInStart)
        const endTime = new Date(value)
        if (formModel.value.checkInStart && startTime > endTime) {
            formModel.value.checkInEnd = null
            return callback('结束入住时间不能小于开始入住时间')
        } else {
            return callback()
        }
    }
}
const formRules = reactive<FormRules<any>>({
    checkInStart: [{ required: true, validator: checkStartTime, trigger: 'blur' }],
    checkInEnd: [{ required: true, validator: checkEndTime, trigger: 'blur' }],
})
function onClose() {
    emits('close')
}
function onConfirm() {
    formRef.value.validate().then((vali) => {
        if (vali) {
            setTimeConfig(formModel.value).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
    })
}
function init() {
    detailTimeConfig(props.conventionId).then((res) => {
        formModel.value = res.data
    })
}
init()
</script>

<style scoped lang="scss"></style>
