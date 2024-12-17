<template>
    <el-container class="wh-full">
        <el-header class="flex items-center">
            <page-header title="分类管理" is-show-btn></page-header>
        </el-header>
        <el-main class="!pt-0">
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-right>
                    <meetingDropForm disabled v-model="formModel.conventionId" />
                </template>
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                    <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
                    <el-button type="warning" @click="onCopy">从其他会议复制</el-button>
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
import { getCategoryList, batchDeleteCategory, deleteCategory } from '~/src/api/before-meeting/material'
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'
import dialogCategory from './components/dialog-category.vue'
import dialogCopyCategory from './components/dialog-copy-category.vue'

const route = useRoute()
const formModel = reactive({
    conventionId: +route.query.conventionId,
})
let maxSortIndex = 0

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)
const gridProps = reactive({
    pagerConfig: false,
    data: [],
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '排序', field: 'sortIndex', width: 80, align: 'center' },
        { title: '分类名称', field: 'name', minWidth: 120, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    getCategoryList({ conventionId: formModel.conventionId }).then((res) => {
        gridProps.data = res.data || []
        // 获取最大的sortIndex
        maxSortIndex =
            gridProps.data.length === 0 ? 1 : Math.max(...gridProps.data.map((item: any) => item.sortIndex)) + 1
    })
}

onMounted(onRefresh)

function onAdd() {
    refDialog.value.openModal({
        component: dialogCategory,
        title: '添加分类',
        width: '480px',
        params: {
            conventionId: formModel.conventionId,
            maxSortIndex,
        },
    })
}

function onEdit(row) {
    refDialog.value.openModal({
        component: dialogCategory,
        title: '添加分类',
        width: '480px',
        params: {
            conventionId: formModel.conventionId,
            ...row,
        },
    })
}

function onDelete(row) {
    ElMessageBox.confirm('确定删除该分类吗？').then(() => {
        deleteCategory(row.categoryID).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onCopy() {
    refDialog.value.openModal({
        component: dialogCopyCategory,
        title: '从其他会议复制',
        width: '480px',
        params: {
            conventionId: formModel.conventionId,
        },
    })
}

function onBatchDelete() {
    const selectedRows = refGrid.value.getSelected()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    ElMessageBox.confirm('确定删除选中的数据吗？').then(() => {
        batchDeleteCategory(selectedRows.map((item: any) => item.categoryID)).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}
</script>
