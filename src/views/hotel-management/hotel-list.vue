<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" size="" @click="onAdd()">添加</el-button>
                </template>

                <template #toolbar-right>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="请输入酒店名称"
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
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { getPersonnelPage, editSortIndex, deletePersonnel, downloadTemplate } from '@/api/personnel-manage'

const formModel = reactive({
    keyword: '',
})

const gridProps = reactive({
    data: getPersonnelPage,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '序号', type: 'seq', minWidth: 80, align: 'center' },
        { title: '酒店名称', field: 'userName', minWidth: 220 },
        { title: '备注', field: 'name', align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
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
</script>
