<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="title" is-show-btn />
        </el-header>
        <el-main>
            <el-row class="el-bg--white p-50px">
                <el-col :span="18" :offset="3">
                    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                        <el-form-item label="会议" prop="conventionID">
                            <b-select v-model="formModel.conventionID" :data="getMeetingDrop"></b-select>
                        </el-form-item>
                        <el-form-item label="开始时间" prop="startTime">
                            <el-date-picker
                                v-model="formModel.startTime"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DDTHH:mm:ss"
                                placeholder="选择开始时间"
                                class="!w-full"
                            />
                        </el-form-item>
                        <el-form-item label="结束时间" prop="endTime">
                            <el-date-picker
                                v-model="formModel.endTime"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DDTHH:mm:ss"
                                placeholder="选择结束时间"
                                class="!w-full"
                            />
                        </el-form-item>
                        <el-form-item label="请假原因" prop="reason">
                            <el-input
                                type="textarea"
                                :rows="4"
                                v-model="formModel.reason"
                                :maxlength="500"
                                show-word-limit
                            />
                        </el-form-item>
                    </el-form>
                    <div class="el-text--center mt-25px">
                        <el-button @click="onClose">取消</el-button>
                        <el-button type="primary" @click="onConfirm()">确定</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getMeetingDrop } from '~/src/api/meeting-manage'

const router = useRouter()
const emits = defineEmits(['confirm'])

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    formData: {
        type: Object,
        default: () => {},
    },
})

const formRef = ref()
const formModel = ref(
    Object.assign(
        {
            id: 0,
            conventionID: 0,
            startTime: '',
            endTime: '',
            reason: '',
        },
        props.formData,
    ),
)
const formRules = reactive({
    conventionID: { required: true, message: '请选择会议' },
    startTime: { required: true, message: '请选择开始时间' },
    endTime: { required: true, message: '请选择结束时间' },
    reason: { required: true, message: '请输入请假原因' },
})

function onClose() {
    router.back()
}

function onConfirm() {
    formRef.value.validate((valid) => {
        if (valid) {
            emits('confirm', formModel.value)
        }
    })
}
</script>
