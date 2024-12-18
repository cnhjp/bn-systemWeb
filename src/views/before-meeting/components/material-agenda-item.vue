<template>
    <div class="item">
        <div>{{ name }}</div>
        <div>
            <el-button size="small" type="primary" @click="onAddAgenda" class="mr-20px" v-if="hasAddAgendaButton">
                添加子项
            </el-button>
            <el-link type="primary" @click="onEditAgenda" class="mr-20px">编辑</el-link>
            <el-link type="danger" @click="onDeleteAgenda">删除</el-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { deleteAgenda } from '~/src/api/before-meeting/material'

const props = defineProps(['item', 'id', 'name'])

const injected = inject<any>('material')

function onDeleteAgenda() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteAgenda(props.id).then(() => {
            ElMessage.success('删除成功')
            injected.onRefresh()
        })
    })
}

const hasAddAgendaButton = computed(() => {
    return props.item.level === 0 && props.item.documentList.length === 0
})

function onEditAgenda() {
    injected.openFormDialog({
        title: '编辑',
        params: {
            agendaID: props.id,
            hideUpload: props.item.hasChildren,
            conventionID: injected.getConventionId(),
        },
    })
}

function onAddAgenda() {
    injected.openFormDialog({
        title: '添加子项',
        params: {
            agendaID: 0,
            parentID: props.id,
            hideUpload: false,
            conventionID: injected.getConventionId(),
        },
    })
}
</script>

<style scoped lang="scss">
.item {
    @apply w-full flex items-center  justify-between  cursor-pointer;
}
</style>
