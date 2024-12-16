<template>
    <b-grid ref="refGrid" v-bind="gridProps">
        <template #toolbar-left>
            <el-button type="primary" size="" @click="onArrange()">一键安排</el-button>
            <el-button type="primary" size="" @click="onAdd()">新增住宿安排</el-button>
            <el-button type="primary" size="" @click="onBatchDelete()">批量删除</el-button>
            <el-button type="primary" size="" @click="onExport()">导出</el-button>
            <el-button type="primary" size="" @click="onImport()">导入</el-button>
            <el-button type="primary" size="" @click="onAdd()">设置住宿时间</el-button>
        </template>

        <template #toolbar-right>
            <el-form :model="formModel" :inline="true">
                <el-form-item label="满员状态">
                    <el-select
                        v-model="formModel.roomStatus"
                        placeholder="满员状态"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option v-for="item in dropList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="酒店名称、房间号、姓名"
                        clearable
                        @keyup.enter="onRefresh"
                        @clear="onRefresh"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #personInfo1="{ row }">
            {{ row.personInfo1?.personName }}
            <span v-if="row.personInfo1?.sexStr">（{{ row.personInfo1?.sexStr }}）</span>
            <el-icon
                class="el-text--danger"
                v-if="row.personInfo1?.personName"
                @click="onDeletePerson(row.personInfo1)"
            >
                <Delete />
            </el-icon>
        </template>
        <template #personInfo2="{ row }">
            {{ row.personInfo2?.personName }}
            <span v-if="row.personInfo2?.sexStr">（{{ row.personInfo2?.sexStr }}）</span>
            <el-icon
                class="el-text--danger"
                v-if="row.personInfo2?.personName"
                @click="onDeletePerson(row.personInfo2)"
            >
                <Delete />
            </el-icon>
        </template>
        <template #actions="{ row }">
            <el-button type="primary" size="small" @click="onSelectPerson(row)" v-if="row.canAssignPerson">
                安排人员
            </el-button>
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
        </template>
    </b-grid>
    <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
</template>

<script setup lang="ts">
import {
    batchDeleteRoom,
    dropDownRoomStatus,
    getRoomPage,
    exportHotelRoom,
    deletePerson,
} from '@/api/accommodation-manage'
import DialogArrange from './dialog-arrange.vue'
import DialogSelectPerson from './dialog-select-person.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
    meetingId: {
        type: Number,
        default: 0,
    },
})

const formModel = ref({
    conventionId: 0,
    keyword: '',
    roomStatus: 0,
})
const exportQuery = ref<any>(null)

// 满员状态下拉
const dropList = ref<any>([])
function dropDownStatus() {
    dropDownRoomStatus().then((res) => {
        dropList.value = res.data
    })
}

const gridProps = reactive({
    data: getRoomPage,
    query: (params: any) => {
        formModel.value.conventionId = props.meetingId
        exportQuery.value = {
            conventionId: props.meetingId,
            orderColumn: params.order,
            roomStatus: formModel.value.roomStatus,
            keyword: formModel.value.keyword,
            pageIndex: params.pageIndex,
            pageSize: params.pageSize,
        }
        return Object.assign(params, formModel.value)
    },
    columns: [
        { type: 'checkbox', minWidth: 60, align: 'center' },
        { title: '序号', type: 'seq', minWidth: 80, align: 'center' },
        { title: '酒店名称', field: 'hotelName', minWidth: 220 },
        { title: '房间号', field: 'roomNumber', minWidth: 120 },
        { title: '房间类型', field: 'roomTypeStr', minWidth: 120 },
        { title: '入住人员1', slots: { default: 'personInfo1' }, minWidth: 160 },
        { title: '入住人员2', slots: { default: 'personInfo2' }, minWidth: 160 },
        {
            title: '操作',
            slots: { default: 'actions' },
            minWidth: 260,
            fixed: 'right',
            headerAlign: 'center',
            align: 'right',
        },
    ],
})

const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

// 弹窗
const refDialog = ref<any>(null)
function openDialog(component: any, title: string, width: string, params: any) {
    refDialog.value.openModal({
        component: component,
        title: title,
        width: width,
        params: {
            ...params,
            conventionId: props.meetingId,
        },
    })
}

function onArrange() {
    openDialog(DialogArrange, '400px', '一键安排', {})
}

function onAdd() {
    console.log('add')
}
function onEdit(row: any) {
    console.log('row', row)
}
function onBatchDelete() {
    const selectArr = refGrid.value.getSelected()
    const ids = selectArr.map((it: any) => it.hotelRoomId)
    if (ids.length > 0) {
        ElMessageBox.confirm('确定删除该房间及入住人员吗？').then(() => {
            batchDeleteRoom(ids).then(() => {
                ElMessage.success('操作成功')
                onRefresh()
            })
        })
    } else {
        ElMessage.warning('请先选择房间')
    }
}
function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该房间及入住人员吗？').then(() => {
        batchDeleteRoom([row.hotelRoomId]).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onDeletePerson(person: any) {
    ElMessageBox.confirm('确定删除该房间及入住人员吗？').then(() => {
        deletePerson(person.hotelRoomPersonId).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onExport() {
    const data = {
        ...exportQuery.value,
        isExpro: false,
    }
    exportHotelRoom(data).then(() => {
        ElMessage.success('操作成功')
    })
}
function onImport() {
    console.log('onImport')
}

function onSelectPerson(row: any) {
    openDialog(DialogSelectPerson, '选择人员', '800px', { hotelRoomId: row.hotelRoomId })
}
function init() {
    dropDownStatus()
}
init()
</script>

<style lang="scss" scoped>
:deep(.el-icon) {
    cursor: pointer;
}
</style>
