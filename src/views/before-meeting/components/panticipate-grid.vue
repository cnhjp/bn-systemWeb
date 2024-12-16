<template>
    <el-container class="wh-full">
        <el-main class="!p-0">
            <b-grid ref="refGrid" v-bind="gridProps" @data="onGridData" @page-change="onPageChange">
                <template #toolbar-left>
                    <el-button type="danger" @click="onBatchDelete()">批量删除</el-button>
                    <el-button type="warning" @click="onBatchChangeStatus()">变更状态</el-button>
                    <el-dropdown @command="onBatchImport" class="ml-12px">
                        <el-button type="primary" size="">
                            导出&nbsp;
                            <el-icon><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="seat">导入座签</el-dropdown-item>
                                <el-dropdown-item command="personnel">导入人员</el-dropdown-item>
                                <el-dropdown-item command="photo">导入照片</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>

                <template #toolbar-right>
                    <el-form inline label-suffix=":">
                        <el-form-item label="角色" class="!mb-0 !mr-12px">
                            <b-select
                                v-model="formModel.conventionRole"
                                defaultFirst
                                v-bind="bindRoleDrop"
                                @change="onRefresh"
                                class="!w-100px"
                            ></b-select>
                        </el-form-item>
                        <el-form-item label="分组" class="!mb-0 !mr-12px">
                            <b-select
                                v-model="formModel.personGroup"
                                defaultFirst
                                v-bind="bindGroupDrop"
                                @change="onRefresh"
                                class="!w-100px"
                            ></b-select>
                        </el-form-item>
                        <el-form-item label="状态" class="!mb-0 !mr-12px">
                            <b-select
                                v-model="formModel.attendStatus"
                                defaultFirst
                                v-bind="bindStatusDrop"
                                @change="onRefresh"
                                class="!w-100px"
                            ></b-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="formModel.keyword"
                                placeholder="请输入账号、桌牌"
                                @keyup.enter="onRefresh"
                                class="!w-180px"
                                clearable
                                @clear="onRefresh"
                            >
                                <template #append>
                                    <el-button icon="Search" @click="onRefresh" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>

                <template #userName="{ row }">
                    {{ row.isPersonDeleted ? row.userName + '(已删除)' : row.userName }}
                </template>

                <template #syncScreen="{ row }">
                    <el-switch v-model="row.allowInScreen" @change="onSyncScreen(row, $event)"></el-switch>
                </template>

                <template #personRole="{ row }">
                    {{ row.conventionRole === 1 ? '出席人员' : '列席人员' }}
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)" v-if="!row.isMainAdmin">
                        删除
                    </el-button>
                </template>
            </b-grid>
        </el-main>
        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { getPersonGroupDrop, getPersonRoleDrop, getPersonAttendStatusDrop } from '~/src/api/common'
import {
    getConventionPersonPage,
    deleteConventionPerson,
    batchDeleteConventionPerson,
    updateScreen,
    downloadPhoto,
} from '~/src/api/before-meeting/personnel'
import dialogChangeStatus from './dialog-change-status.vue'
import dialogEditPanticipate from './dialog-edit-panticipate.vue'
import dialogExportPersonnel from './dialog-export-personnel.vue'
import dialogExportSeat from './dialog-export-seat.vue'

const beforeMeetingPersonnelProvider = inject<any>('beforeMeetingPersonnel')

const props = defineProps({
    conventionId: {
        type: [String, Number],
        default: '',
    },
})

const formModel = reactive({
    conventionRole: '',
    personGroup: '',
    attendStatus: '',
    keyword: '',
})

const bindRoleDrop = {
    data: getPersonRoleDrop,
    query: { IncludeUnknown: true },
}

const bindGroupDrop = {
    data: getPersonGroupDrop,
    query: { IncludeUnknown: true },
}

const bindStatusDrop = {
    data: getPersonAttendStatusDrop,
    query: { IncludeUnknown: true },
}

const refGrid = ref<any>(null)
const refDialog = ref<any>(null)
const gridProps = reactive({
    autoLoad: false,
    data: getConventionPersonPage,
    query: (params) => {
        return Object.assign(params, formModel, {
            conventionId: props.conventionId,
            conventionRole: formModel.conventionRole || 0,
            personGroup: formModel.personGroup || 0,
            attendStatus: +formModel.attendStatus || 0,
        })
    },
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '账号', field: 'userName', minWidth: 180, align: 'center', slots: { default: 'userName' } },
        { title: '桌牌', field: 'seatingName', minWidth: 120, align: 'center' },
        { title: '发起同屏', slots: { default: 'syncScreen' }, minWidth: 120, align: 'center' },
        { title: '座位号', field: 'seatingCode', minWidth: 100, align: 'center' },
        { title: '分组', field: 'personGroup', minWidth: 120, align: 'center' },
        { title: '角色', field: 'personRole', minWidth: 100, align: 'center', slots: { default: 'personRole' } },
        { title: '状态', field: 'attendStatusStr', minWidth: 80, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    refGrid.value.refresh()
}

function onEdit(row) {
    refDialog.value.openModal({
        component: dialogEditPanticipate,
        title: '编辑',
        width: '680px',
        params: {
            conventionPersonId: row.conventionPersonId,
        },
    })
}

function onDelete(row) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        deleteConventionPerson(row.conventionPersonId).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
            beforeMeetingPersonnelProvider.getTabs()
        })
    })
}

function onBatchDelete() {
    const selectedRows = refGrid.value.getSelected()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    ElMessageBox.confirm('确定删除选中的数据吗？').then(() => {
        batchDeleteConventionPerson(selectedRows.map((item: any) => item.conventionPersonId)).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
            beforeMeetingPersonnelProvider.getTabs()
        })
    })
}

function onBatchChangeStatus() {
    const selectedRows = refGrid.value.getSelected()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    refDialog.value.openModal({
        component: dialogChangeStatus,
        title: '修改状态',
        width: '380px',
        params: {
            conventionId: props.conventionId,
            personIdList: selectedRows.map((item: any) => item.conventionPersonId),
        },
    })
}

function onSyncScreen(row, val) {
    updateScreen({
        conventionPersonId: row.conventionPersonId,
        allowInScreen: val,
    }).then(() => {
        ElMessage.success('操作成功')
        onRefresh()
    })
}

let total = 0

function onGridData(data) {
    total = data?.total || 0
}

let currentPage = 1,
    pageSize = 20
function onPageChange(page) {
    currentPage = page.currentPage
    pageSize = page.pageSize
}

function onBatchImport(command: string) {
    switch (command) {
        case 'photo':
            exportPhotos()
            break
        case 'seat':
            exportSeat()
            break
        case 'personnel':
            exportPersonnel()
            break
    }
}

function exportPersonnel() {
    if (total === 0) {
        ElMessage.warning('无数据可导出')
        return
    }
    refDialog.value.openModal({
        component: dialogExportPersonnel,
        title: '导出与会人员',
        width: '680px',
        params: {
            downloadParams: {
                conventionID: props.conventionId,
                conventionRole: +formModel.conventionRole || 0,
                personGroup: +formModel.personGroup || 0,
                attendStatus: +formModel.attendStatus || 0,
                keyword: formModel.keyword,
                isWorker: true,
                pageIndex: currentPage,
                pageSize: pageSize,
                isExpro: true,
                selectedIDs: refGrid.value.getSelected().map((item: any) => item.conventionPersonId),
                orderColumn: '',
                orderColumns: [],
            },
        },
    })
}

function exportSeat() {
    refDialog.value.openModal({
        component: dialogExportSeat,
        title: '导出座签',
        width: '680px',
        params: {
            downloadParams: {
                keyword: formModel.keyword,
                conventionId: props.conventionId,
                conventionRole: +formModel.conventionRole || 0,
                selectedIDs: refGrid.value.getSelected().map((item: any) => item.conventionPersonId),
                personGroup: +formModel.personGroup || 0,
                attendStatus: +formModel.attendStatus || 0,
            },
        },
    })
}

function exportPhotos() {
    const params = {
        attendStatus: +formModel.attendStatus || 0,
        conventionId: props.conventionId,
        conventionRole: +formModel.conventionRole || 0,
        keyword: formModel.keyword,
        personGroup: +formModel.personGroup || 0,
        selectedIDs: refGrid.value.getSelected().map((item: any) => item.conventionPersonId),
    }
    downloadPhoto(params)
}

watch(
    () => props.conventionId,
    (val: string | number) => {
        if (val) {
            onRefresh()
        }
    },
)

defineExpose({
    onRefresh,
})
</script>
