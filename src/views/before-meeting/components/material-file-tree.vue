<template>
    <el-tree
        class="tree"
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        :expand-on-click-node="false"
        @check="onCheck"
    >
        <template #default="{ data }">
            <template v-if="data.isFile">
                <material-file-item
                    :item="data"
                    :id="data.id"
                    :name="data.name"
                    :url="data.url"
                    @deleteFile="onDeleteFile"
                />
            </template>
            <template v-else>
                <material-agenda-item :item="data" :id="data.id" :name="data.name" @deleteAgenda="onDeleteFolder" />
            </template>
        </template>
    </el-tree>
</template>

<script setup lang="ts">
import { deleteFolderFile, deleteFolder } from '~/src/api/before-meeting/material'
import materialAgendaItem from './material-agenda-item.vue'
import materialFileItem from './material-file-item.vue'

const injected = inject<any>('material')

const props = defineProps({
    list: {
        type: Array,
        default: () => [],
    },
})

const treeData = computed(() => {
    const { cloned } = useCloned(props.list)
    return recursiveProcess(cloned.value)
})

function recursiveProcess(list, level = 1) {
    list.forEach((item) => {
        let childFileList = item.childFileList || []
        item.hasChildren = false
        item.isFile = !item.isFolder
        item.hasAddAgendaButton = false
        item.level = level
        if (item.isFile) {
            if (item.fileInfo) {
                item.name = item.fileInfo.sourceName + item.fileInfo.type
                item.url = item.fileInfo.fullFileName
            } else {
                item.name = item.sourceName + item.type
                item.url = item.fullFileName
            }
            item.id = item.categoryDocumentID
        } else {
            item.name = item.name
            item.id = item.folderID
        }
        item.children = childFileList
        recursiveProcess(item.children, level + 1)
    })
    return list
}

function onCheck(_, { checkedNodes }) {
    const categoryDocumentIds = checkedNodes.filter((item) => item.isFile).map((item) => item.id)
    const folderIds = checkedNodes.filter((item) => !item.isFile).map((item) => item.id)
    injected.setFolderIds(folderIds)
    injected.setCategoryDocumentIds(categoryDocumentIds)
}

function onDeleteFile(id) {
    deleteFolderFile(id).then(() => {
        ElMessage.success('删除成功')
        injected.onRefresh()
    })
}

function onDeleteFolder(id) {
    deleteFolder(id).then(() => {
        ElMessage.success('删除成功')
        injected.onRefresh()
    })
}
</script>

<style scoped lang="scss">
.tree {
    @apply bg-transparent;
    :deep(.el-tree-node__content) {
        @apply h-46px bg-white rounded mb-8px pr-20px;
    }
}
</style>
