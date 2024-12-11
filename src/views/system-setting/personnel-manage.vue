<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
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
const gridProps = ref({
    columns: [
        { type: 'checkbox', width: 60 },
        { title: '序号', slots: { default: 'index' }, width: 100 },
        { title: '账号', field: 'account' },
        { title: '姓名', field: 'name' },
        { title: '状态', field: 'status' },
        { title: '最后活跃时间', field: 'lastActiveTime' },
        { title: '操作', slots: { default: 'actions' }, width: 220, align: 'center' },
    ],
    data: [{}],
})

const refGrid = ref(null)

function onEdit(row: any) {}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        console.log(row)
    })
}

function onResetPassword(row: any) {}
</script>
