<template>
    <el-container class="wh-full">
        <el-header class="flex items-center">
            <meeting-drop-form group v-model="formModel.conventionId" @change="onRefresh"></meeting-drop-form>
        </el-header>
        <el-main class="!pt-0">
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                    <el-button type="danger" @click="onBatchDelete()">批量删除</el-button>
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </template>
            </b-grid>
        </el-main>
        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import meetingDropForm from '../components/meeting-drop-form.vue'
import dialogBusForm from './components/dialog-bus-form.vue'
import { getBusPage, batchDeleteBus } from '@/api/bus-manage'

const formModel = reactive({
    conventionId: '',
})

const gridProps = reactive({
    autoLoad: false,
    data: getBusPage,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        {
            type: 'checkbox',
            width: 60,
            align: 'center',
        },
        {
            title: '班次',
            field: 'title',
            minWidth: 80,
        },
        {
            title: '发车时间',
            field: 'startTimeStr',
            minWidth: 80,
        },
        {
            title: '发车地',
            field: 'startAddress',
            minWidth: 180,
        },
        {
            title: '备注',
            field: 'remark',
            minWidth: 180,
        },
        {
            title: '操作',
            slots: { default: 'actions' },
            minWidth: 220,
            fixed: 'right',
            align: 'center',
        },
    ],
})

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)

function onRefresh() {
    nextTick(() => refGrid.value.refresh())
}

function onAdd() {
    refDialog.value.openModal({
        component: dialogBusForm,
        title: '新增',
        width: '680px',
        params: {
            row: {
                conventionId: formModel.conventionId,
            },
        },
    })
}

function onEdit(row: any) {
    refDialog.value.openModal({
        component: dialogBusForm,
        title: '编辑',
        width: '680px',
        params: {
            row,
        },
    })
}

function onDelete(row: any) {
    onBatchDelete([{ id: row.id }])
}

function onBatchDelete(rows?: Array<{ id: number }>) {
    const selectedRows = rows || refGrid.value.getSelected()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    ElMessageBox.confirm('确定删除选中的数据吗？').then(() => {
        batchDeleteBus(selectedRows.map((item: any) => item.id)).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}
</script>
