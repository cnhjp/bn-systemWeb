<template>
    <el-container>
        <el-main class="!p-0">
            <div class="p-16px bg-#fff5e6 border-#ffebcc rounded">
                <div class="flex justify-between mb-10px">
                    <span class="font-bold">导入说明</span>
                    <el-link type="primary" @click="downloadTemplate">下载模板</el-link>
                </div>
                <div class="flex items-center lh-30px">
                    <div class="dot"></div>
                    导入模板中账号和姓名必须填写，且账号不可重复
                </div>
                <div class="flex items-center lh-30px">
                    <div class="dot"></div>
                    账号信息重复导入会覆盖原有的信息，请注意确认
                </div>
            </div>

            <el-upload
                class="mt-20px"
                v-model:file-list="fileList"
                drag
                action=""
                :limit="1"
                :before-upload="onBeforeUpload"
                :http-request="onUpload"
                accept=".xlsx, .xls"
            >
                <el-icon size="50"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="mt-12px">
                    <div>文件大小：50MB&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div>文件格式：.xlsx, .xls</div>
                </div>
            </el-upload>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { downloadTemplate, checkImport } from '~/src/api/personnel-manage'

const fileList = ref<any>([])

const emits = defineEmits(['close', 'openImport', 'importPersonnel'])

function onUpload() {
    return Promise.resolve()
}

function onBeforeUpload(rawFile: File) {
    // 检查文件类型和尺寸
    const isExcel =
        rawFile.type === 'application/vnd.ms-excel' ||
        rawFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const isLt2M = rawFile.size / 1024 / 1024 < 50
    if (!isExcel) {
        ElMessage.error('上传文件格式不正确!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传文件大小不能超过 50MB!')
        return false
    }
    return true
}

function onClose() {
    emits('close')
}

function onConfirm() {
    if (fileList.value.length === 0) {
        ElMessage.error('请上传文件')
        return
    }
    const file = fileList.value[0]
    checkImport({ file: file.raw! }).then(({ data }) => {
        onClose()
        const formData = new FormData()
        formData.append('file', file.raw!)
        if (data?.needUpdatePersonList?.length > 0) {
            emits('openImport', data.needUpdatePersonList, formData)
        } else {
            emits('importPersonnel', formData)
        }
    })
}
</script>

<style scoped lang="scss">
.dot {
    // tailwindcss 集合
    @apply bg-dark w-4px h-4px rounded-full mr-6px;
}
</style>
