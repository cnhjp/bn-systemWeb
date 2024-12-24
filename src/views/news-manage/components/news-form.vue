<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="title" is-show-btn></page-header>
        </el-header>
        <el-main class="bg-white">
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="8em" label-suffix=":">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formModel.title" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model="formModel.content" />
                </el-form-item>
                <el-form-item label="封面" prop="file">
                    <b-upload
                        v-model:file-list="fileList"
                        :http-request="onUpload"
                        :show-file-list="false"
                        :limit="1"
                        :on-success="onUploadSuccess"
                        accept=".png,.jpg,.jpeg,.gif"
                        :size="150"
                    >
                        <template #trigger>
                            <div class="w-130px h-130px">
                                <div class="wh-full relative" v-if="imageUrl">
                                    <div
                                        class="absolute z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        @click.stop
                                    >
                                        <el-icon color="#fff" size="16" @click.stop="onDeleteUpload">
                                            <Delete />
                                        </el-icon>
                                    </div>
                                    <el-image :src="imageUrl" fit="cover" class="wh-full rounded relative z-10" />
                                </div>
                                <div class="wh-full border-dashed border-2 border-gray-300 flex-center" v-else>
                                    <el-icon size="28"><Plus /></el-icon>
                                </div>
                            </div>
                        </template>
                    </b-upload>
                </el-form-item>
            </el-form>

            <div class="flex-center mt-20px">
                <el-button type="default" @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm">确定</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import type { UploadFile } from 'element-plus'

const route = useRoute()
const router = useRouter()
const props = defineProps(['title', 'data'])

// upload
const fileList = ref<any>([])
const imageUrl = ref('')
function onUpload() {
    return Promise.resolve({ data: 0 })
}
function onUploadSuccess(_response: any, file: UploadFile) {
    nextTick(() => {
        imageUrl.value = URL.createObjectURL(file.raw!)
        fileList.value = [{ file }]
    })
}

function onDeleteUpload() {
    imageUrl.value = ''
    fileList.value = []
}

const formModel = reactive<any>({
    newsType: +route.query.newsType,
    newsId: '',
    title: '',
    conventionGroupID: route.query.conventionGroupID,
    content: '',
})

const formRules = reactive({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    conventionGroupID: [{ required: true, message: '请选择会议', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    file: [
        {
            required: true,
            message: '请上传封面',
            validator: (_val, _rule, cb) => {
                if (imageUrl.value) {
                    cb()
                } else {
                    cb(new Error('请上传封面'))
                }
            },
        },
    ],
})

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'confirm'])

function onClose() {
    router.back()
}

function onConfirm() {
    refForm.value.validate((valid: boolean) => {
        if (valid) {
            const formData = new FormData()
            formData.append('title', formModel.title)
            formData.append('conventionGroupID', formModel.conventionGroupID)
            formData.append('content', formModel.content)
            formData.append('newsType', formModel.newsType)
            formData.append('newsId', formModel.newsId || 0)
            if (fileList.value.length) {
                const { file } = fileList.value[0]
                if (file?.raw) {
                    formData.append('file', file.raw)
                }
            }
            emits('confirm', formData)
        }
    })
}

watch(
    () => props.data,
    (val) => {
        if (val) {
            Object.assign(formModel, val)
            imageUrl.value = val.coverPhotoUrl
            formModel.newsId = val.newsID
        }
    },
)
</script>
