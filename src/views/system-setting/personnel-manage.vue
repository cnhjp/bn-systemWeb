<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" size="" @click="onAdd()">添加账号</el-button>
                    <el-button type="danger" size="" @click="onBatchDelete()">批量删除</el-button>
                </template>

                <template #toolbar-right>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="请输入账号、姓名"
                        clearable
                        @keyup.enter="onRefresh"
                        @clear="onRefresh"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </template>

                <template #sortIndex="{ row }">
                    <el-input v-model="row.sortIndex" placeholder="" @blur="debouncedOnIndexChange(row)"></el-input>
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                    <el-button type="danger" size="small" @click="onResetPassword(row)">重置密码</el-button>
                </template>
            </b-grid>
        </el-main>
        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { getPersonnelPage, editSortIndex, deletePersonnel, downloadTemplate } from '@/api/personnel-manage'
import dialogPersonnel from './components/dialog-personnel.vue'

const formModel = reactive({
    keyword: '',
})

const gridProps = reactive({
    data: getPersonnelPage,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { type: 'checkbox', minWidth: 60, align: 'center' },
        { title: '序号', slots: { default: 'sortIndex' }, minWidth: 120 },
        { title: '账号', field: 'userName', minWidth: 120, align: 'center' },
        { title: '姓名', field: 'name', minWidth: 120, align: 'center' },
        { title: '状态', field: 'statusStr', minWidth: 80, align: 'center' },
        { title: '最后活跃时间', field: 'lastOperatingTimeStr', minWidth: 180 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

function onIndexChange(row: any) {
    editSortIndex(row).then(() => {
        ElMessage.success('操作成功')
    })
}

const debouncedOnIndexChange = useDebounceFn(onIndexChange, 1000)

function onAdd() {
    onEdit(1)
    refDialog.value.openModal({
        component: dialogPersonnel,
        title: '添加',
        width: '680px',
    })
}
function onEdit(row: any) {
    downloadTemplate()
}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        deletePersonnel([row.personId]).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onBatchDelete() {
    const selectedRows = refGrid.value.getSelected()
    console.log(selectedRows)
}

function onResetPassword(row: any) {}
</script>
