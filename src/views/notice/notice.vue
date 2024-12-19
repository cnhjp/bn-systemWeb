<template>
    <el-container class="wh-full">
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

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { useRouteStore } from '~/src/store'
import { getGroupPage } from '~/src/api/before-meeting/info'

const routeStore = useRouteStore()
const router = useRouter()
const refGrid = ref<any>(null)

const formModel = reactive({
    keyword: '',
})

const gridProps = reactive({
    data: getGroupPage,
    query: (params) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '序号', type: 'seq', width: 80, align: 'center' },
        { title: '标题', field: 'title', minWidth: 180, align: 'center' },
        { title: '状态', field: 'statusStr', minWidth: 80, align: 'center' },
        { title: '发布时间', field: 'statusStr', minWidth: 80, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    nextTick(() => {
        refGrid.value?.onRefresh()
    })
}

function onAdd() {
    routeStore.cacheRoutes.push('notice')
    router.push({
        name: 'notice-add',
    })
}

function onEdit(row) {
    routeStore.cacheRoutes.push('notice')
    router.push({
        name: 'notice-edit',
        query: {
            id: row.id,
        },
    })
}

onActivated(() => {
    const idx = routeStore.cacheRoutes.indexOf('notice')
    if (idx !== -1) {
        routeStore.cacheRoutes.splice(idx, 1)
    }
})

function onDelete(row) {
    ElMessageBox.confirm('确定删除吗？').then(() => {})
}
</script>
