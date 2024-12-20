<template>
    <div class="item">
        <div>{{ name }}</div>
        <div>
            <el-button size="small" type="primary" @click="onAddAgenda" class="mr-20px" v-if="item.hasAddAgendaButton">
                添加子项
            </el-button>
            <el-link type="primary" @click="onEditAgenda" class="mr-20px">编辑</el-link>
            <el-link type="danger" @click="onDeleteAgenda">删除</el-link>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['item', 'id', 'name'])

const injected = inject<any>('material')
const emits = defineEmits(['deleteAgenda'])

function onDeleteAgenda() {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        emits('deleteAgenda', props.id)
    })
}

function onEditAgenda() {
    injected.openFormDialog({
        title: '编辑',
        params: {
            isDefault: injected.isDefaultCategory.value,
            categoryID: injected.activeCategory.value.categoryID,
            agendaID: props.id,
            folderID: props.id,
            parentID: 0,
            hideUpload: props.item.hasChildren,
            conventionID: injected.getConventionId(),
            isPublish: true,
        },
    })
}

function onAddAgenda() {
    injected.openFormDialog({
        title: '添加子项',
        params: {
            isDefault: true,
            categoryID: 0,
            agendaID: 0,
            folderID: 0,
            parentID: props.id,
            hideUpload: false,
            conventionID: injected.getConventionId(),
            isPublish: true,
        },
    })
}
</script>

<style scoped lang="scss">
.item {
    @apply w-full flex items-center  justify-between  cursor-pointer;
}
</style>
