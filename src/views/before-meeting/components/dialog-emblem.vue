<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="7em" label-suffix=":">
                <el-form-item label="图片" prop="file">
                    <b-upload
                        v-model:file-list="fileList"
                        :http-request="onUpload"
                        :show-file-list="false"
                        :limit="1"
                        :on-success="onUploadSuccess"
                        accept=".png,.jpg,.jpeg,.gif"
                        :size="1024"
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
import { updateEmblem } from '~/src/api/before-meeting/info'
import type { UploadFile } from 'element-plus'

const props = defineProps(['id', 'picUrl', 'sortIndex'])

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'refresh'])

const formModel = reactive({
    id: props.id,
    sortIndex: props.sortIndex,
    file: null,
})

const formRules = reactive({
    file: {
        required: true,
        validator: (_val, _rule, cb) => {
            if (fileList.value.length) {
                cb()
            } else {
                cb('请上传图片')
            }
        },
    },
    sortIndex: { required: true, message: '请输入排序' },
})

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        const formData = new FormData()
        if (fileList.value.length) {
            const { file } = fileList.value[0]
            if (file?.raw) {
                formData.append('file', file.raw)
            }
        }
        formData.append('id', formModel.id || '')
        formData.append('sortIndex', formModel.sortIndex)
        updateEmblem(formData).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}

// upload
const fileList = ref<any>([])
const imageUrl = ref(props.picUrl || '')
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

onMounted(() => {
    if (props.picUrl) {
        imageUrl.value = props.picUrl
        fileList.value = [{ url: props.picUrl }]
    }
})
</script>
