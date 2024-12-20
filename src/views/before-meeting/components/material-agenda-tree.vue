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
                <material-agenda-item :item="data" :id="data.id" :name="data.name" @deleteAgenda="onDeleteAgenda" />
            </template>
        </template>
    </el-tree>
</template>

<script setup lang="ts">
import { deleteAgendaFile, deleteAgenda } from '~/src/api/before-meeting/material'
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
        let children = item.children || []
        let documentList = item.documentList || []
        const hasChildren = children.length > 0
        if (documentList.length) {
            children = documentList
        }
        item.hasChildren = hasChildren
        item.isFile = !!item.documentID
        item.hasAddAgendaButton = level === 1 && documentList.length === 0
        item.level = level
        if (item.isFile) {
            item.name = item.sourceName + item.type
            item.url = item.fullFileName
            item.id = item.agendaDocumentID
        } else {
            if (level === 1) item.name = `【议程】 ${item.title}`
            else if (level === 2) item.name = `【议题】${item.title}`
            item.id = item.id
        }
        item.children = children
        recursiveProcess(item.children, level + 1)
    })
    return list
}

function onCheck(_, { checkedNodes }) {
    const agendaDocumentIds = checkedNodes.filter((item) => item.isFile).map((item) => item.id)
    const agendaIds = checkedNodes.filter((item) => !item.isFile).map((item) => item.id)
    injected.setAgendaIds(agendaIds)
    injected.setAgendaDocumentIds(agendaDocumentIds)
}

function onDeleteFile(id) {
    deleteAgendaFile(id).then(() => {
        ElMessage.success('删除成功')
        injected.onRefresh()
    })
}

function onDeleteAgenda(id) {
    deleteAgenda(id).then(() => {
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
