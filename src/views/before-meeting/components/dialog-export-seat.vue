<template>
    <el-container>
        <el-main class="!flex flex-col items-center justify-center">
            <div class="flex mb-12px">
                <el-button type="primary" @click="onDownloadTemplate">下载模板</el-button>
                <el-button type="primary" @click="onDownloadSeat" class="mr-12px">导出座签</el-button>
                <b-upload
                    :show-file-list="false"
                    :http-request="onHttpRequest"
                    :on-success="onSuccess"
                    accept=".docx"
                    :size="2 * 1024"
                    :tip="false"
                >
                    <template #trigger>
                        <el-button type="primary">导入模板</el-button>
                    </template>
                </b-upload>
            </div>
            <el-image :src="previewImgUrl" class="w-400px h-560px border border-gray-300" />
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { UploadFile } from 'element-plus'
import {
    downloadTemplate,
    downloadSeat,
    previewSeatSignTemplate,
    uploadSeatSignTemplate,
} from '~/src/api/before-meeting/personnel'

const props = defineProps({
    downloadParams: {
        type: Object,
        default: () => ({}),
    },
})
function onDownloadTemplate() {
    downloadTemplate()
}

function onDownloadSeat() {
    downloadSeat(props.downloadParams)
}

const previewImgUrl = ref('')
function getPreviewSeatSignTemplate() {
    previewSeatSignTemplate().then((res) => {
        previewImgUrl.value = res.data?.previewImg
    })
}
onMounted(() => {
    getPreviewSeatSignTemplate()
})

function onHttpRequest() {
    return Promise.resolve()
}

function onSuccess(_resp: any, uploadFile: UploadFile) {
    const { raw } = uploadFile
    uploadSeatSignTemplate({ File: raw }).then(() => {
        ElMessage.success('操作成功')
        getPreviewSeatSignTemplate()
    })
}
</script>
