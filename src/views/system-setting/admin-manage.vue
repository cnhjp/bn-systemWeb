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

                <template #actions="{ row }">
                    <el-button type="danger" size="small" @click="onDelete(row)" v-if="row.role !== 1">删除</el-button>
                </template>
            </b-grid>
        </el-main>
        <b-common-dialog ref="refDialog" @refresh="onRefresh" @choose-personnel="onChoosePersonnel"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { getAdminPage, deleteAdmin, getChooseAdminPage, addAdmin } from '@/api/personnel-manage/admin.ts'
import choosePersonnel from '@/components/business/choose-personnel'

const formModel = reactive({
    keyword: '',
})

const gridProps = reactive({
    data: getAdminPage,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { type: 'checkbox', minWidth: 60, align: 'center' },
        { title: '序号', type: 'seq', minWidth: 60 },
        { title: '账号', field: 'userName', minWidth: 120, align: 'center' },
        { title: '姓名', field: 'name', minWidth: 120, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

function onAdd() {
    refDialog.value.openModal({
        component: choosePersonnel,
        title: '选择人员',
        width: '680px',
        params: {
            gridProps: {
                data: getChooseAdminPage,
                columns: [
                    { type: 'checkbox', width: 60, align: 'center' },
                    { title: '姓名', field: 'name', minWidth: 120, align: 'center' },
                    { title: '账号', field: 'userName', minWidth: 120, align: 'center' },
                    { title: '手机号', field: 'mobilePhone', minWidth: 120, align: 'center' },
                    // { title: '分组', field: 'groupNames', minWidth: 120, align: 'center' },
                ],
            },
        },
    })
}

function onChoosePersonnel(rows: any[], onClose) {
    const ids = rows.map((item: any) => item.personID)
    addAdmin(ids).then(({ data }) => {
        ElMessage.success('操作成功')
        onClose()
        onRefresh()
    })
}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        commonDelete([row.personID])
    })
}

function onBatchDelete() {
    const selectedRows = refGrid.value.getSelected()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    ElMessageBox.confirm('确定删除选中的账号吗？').then(() => {
        commonDelete(selectedRows.map((item: any) => item.personID))
    })
}

function commonDelete(rows: number[]) {
    deleteAdmin(rows).then(({ data }) => {
        const { info } = data
        if (info) ElMessage.warning(info)
        else ElMessage.success('操作成功')
        onRefresh()
    })
}
</script>
