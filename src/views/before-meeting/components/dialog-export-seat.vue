<template>
    <el-container>
        <el-main class="!flex flex-col items-center justify-center">
            <div class="mb-12px">
                <el-button type="primary" @click="onDownloadTemplate">下载模板</el-button>

                <el-button type="primary" @click="onDownloadSeat">导出座签</el-button>
            </div>
            <el-image :src="previewImgUrl" class="w-400px h-560px border border-gray-300" />
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { downloadTemplate, downloadSeat, previewSeatSignTemplate } from '~/src/api/before-meeting/personnel'

const props = defineProps({
    downloadParams: {
        type: Object,
        default: () => ({}),
    },
})

const emits = defineEmits(['close', 'confirm'])

function onDownloadTemplate() {
    downloadTemplate()
}

function onDownloadSeat() {
    downloadSeat(props.downloadParams)
}

function onClose() {
    emits('close')
}

function onConfirm() {}

const previewImgUrl = ref('')
onMounted(() => {
    previewSeatSignTemplate().then((res) => {
        previewImgUrl.value = res.data?.previewImg
    })
})
</script>
