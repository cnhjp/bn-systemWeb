<template>
    <div class="item" :style="{ marginLeft: `${level * 30}px` }">
        <div class="flex flex-center">
            <el-checkbox @click="onToggleChecked" class="!mr-10px"></el-checkbox>
            <div>{{ name }}</div>
        </div>
        <div>
            <el-link type="primary" @click="onDownloadFile" class="mr-15px">下载</el-link>
            <el-link type="danger" @click="onDeleteFile">删除</el-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { deleteFile } from '~/src/api/before-meeting/material'
import { downloadFile } from '~/src/utils'

const props = defineProps(['item', 'id', 'name', 'url', 'level'])

const injected = inject<any>('material')

function onDeleteFile() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteFile(props.id).then(() => {
            ElMessage.success('删除成功')
            injected.onRefresh()
        })
    })
}

function onDownloadFile() {
    downloadFile(props.url, props.name)
}

function onToggleChecked() {
    injected.onToggleFileIds(props.id)
}
</script>

<style scoped lang="scss">
.item {
    @apply flex items-center bg-white px-20px py-10px rounded mb-10px justify-between hover:bg-gray-100 cursor-pointer;
}
</style>
