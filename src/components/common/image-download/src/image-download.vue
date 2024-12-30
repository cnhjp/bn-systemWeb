<template>
    <el-image v-bind="options" @show="onAddDownSet" />
</template>
<script setup lang="ts">
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    options: {
        type: Object,
        default: () => {},
    },
    closeDownload: {
        type: Boolean,
        default: false,
    },
    fileName: {
        type: String,
        default: '',
    },
})

// 添加下载图标
function onAddDownSet() {
    if (!props.closeDownload) {
        console.log('1')
        nextTick(() => {
            const _this = document.getElementsByClassName('el-image-viewer__wrapper')[0]
            const btnGroup = _this.getElementsByClassName('el-image-viewer__actions__inner')[0]
            const downloadHtml = `<i class="el-icon down-load"><svg data-v-d2e47025="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z"></path></svg></i>`
            btnGroup.insertAdjacentHTML('beforeend', downloadHtml)
            const downLoadBtn = btnGroup.getElementsByClassName('down-load')[0]
            downLoadBtn.addEventListener('click', () => {
                downloadImage()
            })
        })
    }
}

function downloadImage() {
    const _this = document.getElementsByClassName('el-image-viewer__img')[0] as any
    const url = _this?.src
    // 防止文件直接打开
    fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
            let fullUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a') //创建a标签
            link.href = fullUrl
            link.style.display = 'none'
            link.setAttribute('download', props.fileName)
            document.body.appendChild(link)
            link.click()
        })
        .catch(() => {
            ElMessage.error('下载失败')
        })
}
</script>
