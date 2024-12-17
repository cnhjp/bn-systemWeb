<template>
    <div class="item" :style="{ marginLeft: `${level * 30}px` }">
        <div class="flex flex-center">
            <el-checkbox @click="onToggleChecked" class="!mr-10px"></el-checkbox>
            <div>{{ name }}</div>
        </div>
        <div>
            <el-button size="small" type="primary" class="mr-20px" v-if="hasAddAgendaButton">添加子项</el-button>
            <el-link type="primary" @click="onEditAgenda" class="mr-20px">编辑</el-link>
            <el-link type="danger" @click="onDeleteAgenda">删除</el-link>
        </div>
    </div>

    <material-agenda-item
        v-for="(item2, idx) of item.children || []"
        :key="idx"
        :item="item2"
        :id="item2.id"
        :name="`【${AGENDA_MAP[(item2 as any).agendaType]}】 ${(item2 as any).title}`"
        :level="level + 1"
    />

    <material-file-item
        v-for="(item2, idx) of item.documentList || []"
        :key="idx"
        :item="item2"
        :id="item2.agendaDocumentID"
        :name="item2.sourceName + item2.type"
        :level="level + 1"
    />
</template>

<script setup lang="ts">
import { deleteAgenda } from '~/src/api/before-meeting/material'
import materialFileItem from './material-file-item.vue'
import materialAgendaItem from './material-agenda-item.vue'
import { AGENDA_MAP } from '~/src/constant/meeting'

const props = defineProps(['item', 'id', 'name', 'level'])

const injected = inject<any>('material')

function onDeleteAgenda() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteAgenda(props.id).then(() => {
            ElMessage.success('删除成功')
            injected.onRefresh()
        })
    })
}

function onToggleChecked() {
    injected.onToggleAgendaIds(props.id)
}

const hasAddAgendaButton = computed(() => {
    return props.level === 0 && props.item.documentList.length === 0
})

function onEditAgenda() {}
</script>

<style scoped lang="scss">
.item {
    @apply flex items-center bg-white px-20px py-10px rounded mb-10px justify-between;
}
</style>
