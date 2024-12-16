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
import { useRouter } from 'vue-router'
import { deleteHotel, getHotelPage } from '@/api/hotel-manage'

const router = useRouter()
const formModel = ref({
    keyword: '',
})

const gridProps = reactive({
    data: getHotelPage,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '序号', type: 'seq', minWidth: 60, align: 'center' },
        { title: '酒店名称', field: 'name', minWidth: 220 },
        { title: '联系方式', field: 'contact', minWidth: 120 },
        { title: '酒店地址', field: 'address', minWidth: 120 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}
function onAdd() {
    router.push({ name: 'hotel-manage-add' })
}
function onEdit(row: any) {
    router.push({ name: 'hotel-manage-edit', query: { id: row.id } })
}
function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        deleteHotel(row.id).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}
</script>
