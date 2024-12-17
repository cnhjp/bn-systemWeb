<template>
    <el-container>
        <el-main>
            <b-upload
                ref="refUpload"
                :http-request="onHttpRequest"
                v-model:file-list="fileList"
                accept=".pdf,.doc,.docx,.wps,.xls,.xlsx,.ppt,.pptx,.jpg,.gif,.png,.jpeg,.bmp,.mp4,.mp3,.ofd"
                :size="2000 * 1024"
                multiple
            >
                <template #tip>
                    <div class="font-size-12px color-#9ca3af ml-20px">
                        <div>点击上传按钮，文件将通过加密的方式进行上传。</div>
                        <div>
                            文件格式：.pdf, .doc, .docx, .wps, .xls, .xlsx, .ppt, .pptx, .jpg, .gif, .png, .jpeg, .bmp,
                            .mp4, .mp3, .ofd
                        </div>
                        <div>文件大小：2000MB</div>
                    </div>
                </template>
            </b-upload>
        </el-main>

        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { uploadDocument } from '~/src/api/common'
import { uploadFile } from '~/src/api/before-meeting/material'
import { UploadRequestOptions } from 'element-plus'

const props = defineProps(['categoryID', 'conventionId', 'folderID'])

const formModel = reactive({
    categoryID: props.categoryID || 0,
    conventionId: props.conventionId,
    folderID: props.folderID || 0,
    documentIDList: [],
})

const refUpload = ref(null)

const fileList = ref<any>([])

const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}

function onConfirm() {
    if (!fileList.value.length) {
        ElMessage.error('请上传文件')
        return
    }
    formModel.documentIDList = fileList.value.map((item) => item.response)
    uploadFile(formModel).then(() => {
        emits('refresh')
        onClose()
    })
}

function onHttpRequest(options: UploadRequestOptions) {
    return uploadDocument({
        file: options.file,
        importType: '2',
        version: Math.random(),
    })
}
</script>
