<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-right>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="请输入"
                        clearable
                        @keyup.enter="onRefresh"
                        @clear="onRefresh"
                        v-show="false"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </template>

                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </template>

                <template #status="{ row }">
                    <el-tag :type="row.approvalStatus === 1 ? 'success' : 'danger'" v-if="row.approvalStatus !== 0">{{row.approvalStatusStr}}</el-tag>
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onView(row)">查看</el-button>
                    <el-button type="danger" size="small" @click="onSetStatus(row)">
                        {{ [0, 2].includes(row.approvalStatus) ? '通过' : '拒绝' }}
                    </el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { useRouteStore, useUserStore } from '~/src/store'
import { getTakeLeavePage, deleteTakeLeave, setTakeLeavePassed, setTakeLeaveNotPassed } from '~/src/api/take-leave'

const userStore = useUserStore()
const routeStore = useRouteStore()
const router = useRouter()
const refGrid = ref<any>(null)

const formModel = reactive({ keyword: '' })
const gridProps = reactive({
    data: getTakeLeavePage,
    query: (params) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '序号', type: 'seq', width: 80, align: 'center' },
        { title: '会议名称', field: 'conventionTitle', minWidth: 180, align: 'center' },
        { title: '状态', slots: { default: 'status' }, minWidth: 80, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 280, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    nextTick(() => {
        refGrid.value?.refresh()
    })
}

function onAdd() {
    routeStore.cacheRoutes.push('take-leave')
    router.push({
        name: 'take-leave-add',
    })
}

function onEdit(row) {
    routeStore.cacheRoutes.push('take-leave')
    router.push({
        name: 'take-leave-edit',
        query: {
            ...row,
        },
    })
}

onActivated(() => {
    const idx = routeStore.cacheRoutes.indexOf('take-leave')
    if (idx !== -1) {
        routeStore.cacheRoutes.splice(idx, 1)
    }
    userStore.getLeaveCount()
    onRefresh()
})

function onDelete(row) {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteTakeLeave(row.id).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onView(row) {
    routeStore.cacheRoutes.push('take-leave')
    router.push({
        name: 'take-leave-detail',
        query: {
            ...row,
        },
    })
}

function onSetStatus(row) {
    ElMessageBox.confirm('确定更新状态吗？').then(() => {
        const api = [0, 2].includes(row.approvalStatus) ? setTakeLeavePassed : setTakeLeaveNotPassed
        api(row.id).then(() => {
            ElMessage.success('操作成功')
            userStore.getLeaveCount() //重新获取通知数量
            onRefresh()
        })
    })
}
</script>
