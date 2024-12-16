<template>
    <el-container>
        <el-main>
            <b-upload
                v-model:file-list="fileList"
                multiple
                :http-request="onUpload"
                :size="50 * 1000"
                :tip="true"
                :before-upload="onBeforeUpload"
                accept=".jpg,.png"
                @error="handleUploadError"
                @all-complete="onAllComplete"
            ></b-upload>

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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject()
        }, 2000)
    })
}

function onBeforeUpload(file) {
    console.log('上传文件前:', file)
    return Promise.resolve()
}

function onAllComplete() {
    console.log('所有文件上传完成')
}
</script>
