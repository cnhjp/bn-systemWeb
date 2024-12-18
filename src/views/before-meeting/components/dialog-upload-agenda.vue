<template>
    <el-container ref="refContainer">
        <el-main>
            <div class="font-bold text-xl">上传会议文件压缩包，系统会自动生成完整会议议题。</div>
            <div class="text-lg lh-40px">提示：</div>
            <div class="lh-30px text-gray-500">
                <div>1、议题文件压缩包名称没有限制，可以包含会议的所有议题和文件。</div>
                <div>2、会议只支持一级议题，压缩包里的文件夹名称作为议题名称。</div>
                <div>3、一个议题可以有多个文件，议题文件放在对应的议题文件夹中。</div>
                <div>4、上传成功后，系统会根据文件夹自动生成议题，并关联文件夹内的议题文件。</div>
                <div>5、支持格式：.zip</div>
                <div>点击上传按钮，文件将通过加密的方式进行上传。</div>
            </div>
            <el-button type="primary" @click="onDownload" class="mt-12px">示例下载</el-button>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { downloadAgendaTemplate } from '~/src/api/before-meeting/material'
import { ElLoading } from 'element-plus'

const emits = defineEmits(['close', 'confirm'])

function onClose() {
    emits('close')
}
function onConfirm() {
    emits('confirm')
}

const refContainer = ref<any>(null)
function onDownload() {
    const loading = ElLoading.service({
        target: refContainer.value.$el,
        lock: true,
        text: '下载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)',
    })
    downloadAgendaTemplate().finally(() => {
        loading.close()
    })
}
</script>
