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
                <material-file-item :item="data" :id="data.id" :name="data.name" />
            </template>
            <template v-else>
                <material-agenda-item :item="data" :id="data.id" :name="data.name" />
            </template>
        </template>
    </el-tree>
</template>

<script setup lang="ts">
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

function recursiveProcess(list, level = 0) {
    list.forEach((item) => {
        let children = item.children || []
        const documentList = item.documentList || []
        const isFile = !!item.documentID
        const isAgendaFile = isFile && !item.fileInfo
        let hasChildren = true
        if (documentList.length) {
            children = documentList
            hasChildren = false
        }
        item.id = item.id || item.agendaDocumentID || item.categoryDocumentID
        item.children = children
        item.level = level
        item.isFile = isFile
        item.isAgendaFile = isAgendaFile
        item.hasChildren = hasChildren
        if (isFile) {
            if (item.fileInfo) {
                item.name = item.fileInfo.sourceName + item.fileInfo.type
                item.url = item.fileInfo.fullFileName
            } else {
                item.name = item.sourceName + item.type
                item.url = item.fullFileName
            }
        } else {
            if (level === 0) {
                item.name = `【议程】 ${item.title}`
            } else {
                item.name = `【议题】 ${item.title}`
            }
        }
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
</script>

<style scoped lang="scss">
.tree {
    @apply bg-transparent;
    :deep(.el-tree-node__content) {
        @apply h-46px bg-white rounded mb-8px pr-20px;
    }
}
</style>
