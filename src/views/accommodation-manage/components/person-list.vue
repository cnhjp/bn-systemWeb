<template>
    <b-grid ref="refGrid" v-bind="gridProps" @checkbox-change="onCheckChange">
        <template #toolbar-left>
            <el-button type="primary" size="" @click="onSetting" v-if="!isDialog">设置房间要求</el-button>
        </template>

        <template #toolbar-right>
            <el-form :model="formModel" :inline="true">
                <el-form-item label="会议角色" v-if="!isDialog">
                    <el-select
                        v-model="formModel.personRole"
                        placeholder="会议角色"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option
                            v-for="item in roleDropList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="房间要求">
                    <el-select
                        v-model="formModel.roomType"
                        placeholder="房间要求"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option
                            v-for="item in roomDropList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="姓名/账号"
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

        <template #actions="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        </template>
    </b-grid>
    <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
</template>

<script setup lang="ts">
import { dropDownRoomType, dropDownPersonRole, getPersonPage, getSelectPersonPage } from '@/api/accommodation-manage'
import { DropResponse } from '@/api/accommodation-manage/types.ts'
import { dropDownSetValueNumner } from '@/utils/common'
import { ElMessage } from 'element-plus'
import DialogSettingRoomType from './dialog-setting-room-type.vue'
import { nextTick } from 'vue'

const props = defineProps({
    meetingId: {
        type: Number,
        default: 0,
    },
    isDialog: {
        type: Boolean,
        default: false,
    },
    maxPerson: {
        type: Number,
        default: 1,
    },
    roomType: {
        type: Number,
        default: 1,
    },
})

const formModel = ref({
    conventionId: 0,
    keyword: '',
    personRole: 0,
    personGroupId: 0,
    roomType: 0,
})

// 房间类型下拉
const roomDropList = ref<DropResponse[]>([])
function dropDownRoom() {
    dropDownRoomType().then((res) => {
        roomDropList.value = dropDownSetValueNumner(res.data, true, true)
    })
}

//会议角色下拉
const roleDropList = ref<DropResponse[]>([])
function dropDownRole() {
    dropDownPersonRole().then((res) => {
        roleDropList.value = dropDownSetValueNumner(res.data, true, true)
    })
}

// 列表
const refGrid = ref<any>(null)
const gridProps = reactive<any>({
    autoLoad: false,
    data: props.isDialog ? getSelectPersonPage : getPersonPage,
    query: (params: any) => {
        formModel.value.conventionId = props.meetingId
        return Object.assign(params, formModel.value)
    },
    columns: [],
})

function onRefresh() {
    refGrid.value.refresh()
}
// 设置房间要求弹窗
const refDialog = ref<any>(null)
function onSetting() {
    const ids = getSelectPerson()
    if (ids.length > 0) {
        const params = {
            conventionPersonIdList: ids,
        }
        openDialog(params)
    } else {
        ElMessage.warning('请先选择住宿人员')
    }
}

function onEdit(row: any) {
    const type = roomDropList.value.find((it) => it.label === row.roomTypeStr)
    const params = {
        conventionPersonIdList: [row.conventionPersonId],
        type: type || 0,
    }
    openDialog(params)
}

function openDialog(params: any) {
    refDialog.value.openModal({
        component: DialogSettingRoomType,
        title: '设置房间要求',
        width: '400px',
        params: {
            ...params,
            list: roomDropList.value,
            conventionId: props.meetingId,
        },
    })
}

function init() {
    if (props.isDialog) {
        formModel.value.roomType = props.roomType
        gridProps.columns = [
            { type: 'checkbox', minWidth: 60, align: 'center' },
            { title: '姓名', field: 'personName', minWidth: 220 },
            { title: '性别', field: 'sexStr', minWidth: 120 },
            { title: '房间要求', field: 'roomTypeStr', minWidth: 120 },
        ]
    } else {
        gridProps.columns = [
            { type: 'checkbox', minWidth: 60, align: 'center' },
            { title: '姓名', field: 'name', minWidth: 220 },
            { title: '性别', field: 'sexStr', minWidth: 120 },
            { title: '会议角色', field: 'personRoleStr', minWidth: 120 },
            { title: '房间要求', field: 'roomTypeStr', minWidth: 120 },
            { title: '房间号', field: 'hotelRoomName', minWidth: 120 },
            { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
        ]
    }
    nextTick(() => {
        onRefresh()
    })
    dropDownRoom()
    dropDownRole()
}
init()

//以下为组件使用公用方法

//获取选中项
const getSelectPerson = () => {
    return refGrid.value.getSelected()
}

//选中项切换时
const onCheckChange = ({ records }) => {
    if (records.length > props.maxPerson) {
        ElMessage.warning(`最多只可以安排${props.maxPerson}人`)
        records.forEach((item: any, index: number) => {
            refGrid.value.vxeGrid.setCheckboxRow(item, index > props.maxPerson - 1 ? false : true)
        })
        return
    }
}

defineExpose({
    getSelectPerson,
})
</script>

<style lang="scss" scoped>
:deep(.el-select) {
    min-width: 100px;
}
</style>
