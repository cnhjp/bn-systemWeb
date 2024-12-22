<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="title" is-show-btn />
        </el-header>
        <el-main>
            <el-row class="el-bg--white p-50px">
                <el-col :span="18" :offset="3">
                    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                        <el-form-item label="标题" prop="title">
                            <el-input
                                v-model="formModel.title"
                                plceholder="请输入标题"
                                :maxlength="30"
                                show-word-limit
                            />
                        </el-form-item>
                        <el-form-item label="通知内容" prop="description">
                            <el-input
                                type="textarea"
                                :rows="6"
                                v-model="formModel.description"
                                plceholder="请输入通知内容"
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
            title: '',
            description: '',
            isPublish: true,
            publishTime: '2024-12-19T13:05:36.106Z',
            conventionId: 0,
        },
        props.formData,
        {
            isPublish: props.formData.isPublish && props.formData.isPublish !== 'false' ? true : false,
        },
    ),
)
const formRules = reactive({
    title: { required: true, message: '请输入标题' },
    description: { required: true, message: '请输入内容' },
})

function onClose() {
    router.back()
}

function onConfirm() {
    formRef.value.validate((valid) => {
        if (valid) {
            emits('confirm', formModel)
        }
    })
}
</script>
