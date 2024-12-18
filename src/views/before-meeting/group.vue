<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="分组管理" is-show-btn></page-header>
        </el-header>
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </template>
                <template #toolbar-right>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="请输入"
                        clearable
                        @keyup.enter="onRefresh"
                        @clear="onRefresh"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </template>

                <template #startTime="{ row }">
                    <span>{{ row.startTime.replace('T', ' ') }}</span>
                </template>

                <template #endTime="{ row }">
                    <span>{{ row.endTime.replace('T', ' ') }}</span>
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
import { getGroupPage, deleteGroup } from '~/src/api/before-meeting/info'
import dialogGroupForm from './components/dialog-group-form.vue'

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)

const formModel = reactive({
    keyword: '',
})

const gridProps = reactive({
    data: getGroupPage,
    query: (params) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '名称', field: 'title', minWidth: 180 },
        { title: '开始时间', field: 'startTimeStr', slots: { default: 'startTime' }, minWidth: 180, align: 'center' },
        { title: '结束时间', field: 'endTimeStr', slots: { default: 'endTime' }, minWidth: 180, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    nextTick(() => {
        refGrid.value?.refresh()
    })
}

function onAdd() {
    refDialog.value.openModal({
        component: dialogGroupForm,
        title: '新增分组',
        width: '480px',
    })
}

function onEdit(row) {
    refDialog.value.openModal({
        component: dialogGroupForm,
        title: '编辑分组',
        width: '480px',
        params: {
            ...row,
        },
    })
}

function onDelete(row) {
    ElMessageBox.confirm('确定删除该分组吗？').then(() => {
        deleteGroup({ groupId: row.id }).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}
</script>
