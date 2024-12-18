<template>
    <div class="item">
        <div>{{ name }}</div>
        <div>
            <el-link type="primary" @click="onDownloadFile" class="mr-15px">下载</el-link>
            <el-link type="danger" @click="onDeleteFile">删除</el-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { deleteFile, deleteAgendaFile } from '~/src/api/before-meeting/material'
import { downloadFile } from '~/src/utils'

const props = defineProps(['item', 'id', 'name', 'url'])

const injected = inject<any>('material')

function onDeleteFile() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        const api = props.item.isAgendaFile ? deleteAgendaFile : deleteFile
        api(props.id).then(() => {
            ElMessage.success('删除成功')
            injected.onRefresh()
        })
    })
}

function onDownloadFile() {
    downloadFile(props.url, props.name)
}
</script>

<style scoped lang="scss">
.item {
    @apply w-full flex items-center  justify-between  cursor-pointer;
}
</style>
