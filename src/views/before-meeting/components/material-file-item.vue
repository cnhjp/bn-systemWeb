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
import { downloadFile } from '~/src/utils'

const props = defineProps(['item', 'id', 'name', 'url'])
const emits = defineEmits(['deleteFile'])

function onDeleteFile() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        emits('deleteFile', props.id)
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
