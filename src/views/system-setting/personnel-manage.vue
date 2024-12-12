<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" size="small" @click="onBatchDelete()">批量删除</el-button>
                </template>

                <template #toolbar-right>
                    <el-input v-model="formModel.keyword" placeholder="请输入账号、姓名" @keyup.enter="onRefresh">
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </template>

                <template #index="{ row }">
                    <el-input-number
                        class="!w-full"
                        v-model="row.index"
                        :min="1"
                        controls-position="right"
                        size="large"
                        @change="onIndexChange(row)"
                    />
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                    <el-button type="danger" size="small" @click="onResetPassword(row)">重置密码</el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
const formModel = reactive({
    keyword: '',
})

const gridProps = ref({
    data: [{ index: '' }],
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '序号', slots: { default: 'index' }, width: 120 },
        { title: '账号', field: 'account' },
        { title: '姓名', field: 'name' },
        { title: '状态', field: 'status' },
        { title: '最后活跃时间', field: 'lastActiveTime' },
        { title: '操作', slots: { default: 'actions' }, width: 220, align: 'center' },
    ],
})

const refGrid = ref<any>(null)

function onRefresh() {
    console.log(9090)
    refGrid.value.refresh()
}

function onIndexChange(row: any) {}

function onEdit(row: any) {}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        console.log(row)
    })
}

function onBatchDelete() {
    const selectedRows = refGrid.value.getSelected()
    console.log(selectedRows)
}

function onResetPassword(row: any) {}
</script>
