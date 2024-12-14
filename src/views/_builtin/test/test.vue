<template>
    <el-container>
        <el-main>
            <b-upload
                v-model:file-list="fileList"
                :http-request="onUpload"
                :size="50 * 1000"
                :tip="true"
                list-type="picture-card"
                :show-file-list="false"
                accept=".jpg,.png"
                @error="handleUploadError"
            >
                <el-icon><Plus /></el-icon>
            </b-upload>

            <div>{{ fileList }}</div>
        </el-main>
    </el-container>
</template>

<script setup>
const handleUploadError = (err, file) => {
    console.error('上传错误:', err)
    console.log('错误文件:', file)
    // ElMessage.error(err.message)
}

const fileList = ref([])

function onUpload(file) {
    console.log('上传文件:', file)
    return Promise.resolve()
}

function onBeforeUpload(file) {
    console.log('上传文件前:', file)
    return true
}
</script>
