<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="80px" label-suffix=":">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formModel.title" maxlength="500" show-word-limit type="textarea" />
                </el-form-item>
                <el-form-item label="附件" v-if="!hideUpload">
                    <b-upload
                        ref="refUpload"
                        :http-request="onHttpRequest"
                        v-model:file-list="fileList"
                        accept=".pdf,.doc,.docx,.wps,.xls,.xlsx,.ppt,.pptx,.jpg,.gif,.png,.jpeg,.bmp,.mp4,.mp3,.ofd"
                        :size="2000 * 1024"
                        multiple
                        :tip="false"
                    ></b-upload>
                    <div class="font-size-12px color-#9ca3af">
                        <div>点击上传按钮，文件将通过加密的方式进行上传。</div>
                        <div>
                            文件格式：.pdf, .doc, .docx, .wps, .xls, .xlsx, .ppt, .pptx, .jpg, .gif, .png, .jpeg, .bmp,
                            .mp4, .mp3, .ofd
                        </div>
                        <div>文件大小：2000MB</div>
                    </div>
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
import { uploadDocument } from '~/src/api/common'
import { addAgenda, updateAgenda, getAgendaDetail } from '~/src/api/before-meeting/material'
import { UploadRequestOptions } from 'element-plus'

const props = defineProps(['agendaID', 'conventionID', 'parentID', 'hideUpload'])

const refForm = ref()
const formModel = reactive({
    agendaID: props.agendaID || 0,
    conventionID: props.conventionID,
    parentID: props.parentID || 0,
    isPublish: true,
    title: '',
    documentList: [],
})

const formRules = reactive({
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
})

const refUpload = ref(null)

const fileList = ref<any>([])

const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        formModel.documentList = fileList.value
            .filter((item) => {
                return !!item.response
            })
            .map((item) => {
                return item.response
            })
        const api = formModel.agendaID ? updateAgenda : addAgenda
        const formData = new FormData()
        formData.append('title', formModel.title)
        formData.append('conventionID', formModel.conventionID)
        formData.append('parentID', formModel.parentID)
        formData.append('isPublish', String(formModel.isPublish))
        formData.append('agendaID', formModel.agendaID)
        formModel.documentList.forEach((item) => {
            formData.append('documentIds', item)
        })
        api(formData).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}

function onHttpRequest(options: UploadRequestOptions) {
    return uploadDocument({
        file: options.file,
        importType: '2',
    })
}

onMounted(() => {
    if (props.agendaID) {
        getAgendaDetail(props.agendaID).then((res) => {
            Object.assign(formModel, res.data)
            fileList.value = (formModel.documentList || []).map((item) => {
                return {
                    ...item,
                    name: item.sourceName + item.type,
                    url: item.fullFileName,
                }
            })
        })
    }
})
</script>
