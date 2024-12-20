<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="会徽配置" is-show-btn></page-header>
        </el-header>

        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </template>

                <template #image="{ row }">
                    <el-image :src="row.picUrl" class="w-40px h-40px"></el-image>
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)" v-if="!row.isDefault">删除</el-button>
                </template>
            </b-grid>
        </el-main>

        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>
<script setup lang="ts">
import { getEmblemList, deleteEmblem } from '~/src/api/before-meeting/info'
import dialogEmblem from './components/dialog-emblem.vue'

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)

const gridProps = reactive({
    pagerConfig: false,
    data: [],
    columns: [
        { title: '排序', field: 'sortIndex', minWidth: 120 },
        { title: '图片', field: 'name', slots: { default: 'image' }, minWidth: 120, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    nextTick(() => {
        getEmblemList().then(({ data }) => {
            gridProps.data = data || []
        })
    })
}

function onAdd() {
    refDialog.value.openModal({
        component: dialogEmblem,
        title: '新增',
        width: '480px',
        params: {
            sortIndex: getMaxSortIndex(),
        },
    })
}

function onEdit(row: any) {
    refDialog.value.openModal({
        component: dialogEmblem,
        title: '编辑',
        width: '480px',
        params: {
            ...row,
        },
    })
}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteEmblem(row.id).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function getMaxSortIndex() {
    if (gridProps.data.length > 0) {
        return Math.max(...gridProps.data.map((item: any) => item.sortIndex)) + 1
    }
    return 1
}

onRefresh()
</script>
