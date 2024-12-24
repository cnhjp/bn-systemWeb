<template>
    <el-container class="wh-full">
        <el-main class="el-flex is-column">
            <div class="el-bg--white p-20px tools-wrapper">
                <div class="el-flex is-center-between mb-30px">
                    <div>
                        <el-button type="primary" @click="onSetAll">一键全签</el-button>
                        <el-button type="primary" @click="onExport">导出</el-button>
                    </div>
                    <div>
                        <el-form inline>
                            <el-form-item label="会议">
                                <el-select v-model="formModel.conventionID">
                                    <el-option
                                        v-for="item in dropMeeting"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select v-model="formModel.attendStatus">
                                    <el-option
                                        v-for="item in dropAttendanceStatus"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    v-model="formModel.keyword"
                                    placeholder="请输入名字"
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
                    </div>
                </div>
                <div class="el-flex is-center-between total-wrapper">
                    <div>
                        <p>总人数</p>
                        {{ overview.total }}
                    </div>
                    <div>
                        <p>已签</p>
                        {{ overview.attend }}
                    </div>
                    <div>
                        <p>未签</p>
                        {{ overview.absent }}
                    </div>
                    <div>
                        <p>请假</p>
                        {{ overview.leave }}
                    </div>
                </div>
            </div>
            <div class="el-bg--white p-20px mt-20px list-wrapper">
                <b-grid ref="refGrid" v-bind="gridProps">
                    <template #attendStatusStr="{ row }">
                        <el-tag :type="setStatusTag(row.attendStatus)" v-if="row.attendStatusStr">
                            {{ row.attendStatusStr }}
                        </el-tag>
                    </template>
                    <template #actions="{ row }">
                        <el-button type="primary" size="small" @click="openDialog(row)">修改状态</el-button>
                    </template>
                </b-grid>
            </div>
        </el-main>
        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>
<script setup lang="ts">
import { DropResponse } from '@/api/common/types.ts'
import { dropDownMeeting } from '@/api/common'
import {
    dropDownAttendanceStatus,
    exportPerson,
    getAttendPage,
    overViewAttendance,
    setAllAttendance,
} from '@/api/attendance-manage'
import { dropDownSetValueNumner } from '@/utils'
import DialogChangeAttendanceStatus from '@/views/attendance-manage/components/dialog-change-attendance-status.vue'
import { ElMessage } from 'element-plus'

const formModel = ref<any>({
    conventionID: 0,
    keyword: '',
    attendStatus: null,
})
const exportQuery = ref<any>(null)
const gridProps = reactive({
    autoLoad: false,
    data: getAttendPage,
    query: (params: any) => {
        const attendStatus = formModel.value.attendStatus ? formModel.value.attendStatus : 0
        exportQuery.value = Object.assign(params, formModel.value, { attendStatus: attendStatus })
        return exportQuery
    },
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '姓名', field: 'seatingName', minWidth: 220 },
        { title: '状态', slots: { default: 'attendStatusStr' }, minWidth: 220 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

function setStatusTag(status: any) {
    switch (status) {
        case 1:
            return 'success'
        case 2:
            return 'info'
        case 3:
            return 'danger'
    }
}

function onSetAll() {
    setAllAttendance(formModel.value.conventionID).then(() => {
        ElMessage.success('操作成功')
        onRefresh()
    })
}

function onExport() {
    exportQuery.value.isExpor = true
    exportQuery.value.IsWorker = false
    exportQuery.value.orderColumn = ''
    exportQuery.value.orderColumns = []
    exportQuery.value.exportFields = ['seatingName', 'status']
    exportQuery.value.selectedIDs = refGrid.value.getSelected().map((item: any) => item.conventionPersonId)
    exportPerson(exportQuery.value).then(() => {
        ElMessage.success('操作成功')
    })
}

// 弹窗
const refDialog = ref<any>(null)
function openDialog(params: any) {
    refDialog.value.openModal({
        component: DialogChangeAttendanceStatus,
        title: '修改状态',
        width: '400px',
        params: {
            attendStatus: params.attendStatus,
            ids: [params.conventionPersonId],
            list: dropAttendanceStatus.value,
        },
    })
}

const dropMeeting = ref<DropResponse[]>([])
const dropAttendanceStatus = ref<any[]>([])
const overview = ref<any>({
    total: 0,
    absent: 0,
    leave: 0,
    attend: 0,
})
async function init() {
    await dropDownMeeting().then((res) => {
        dropMeeting.value = dropDownSetValueNumner(res.data, false, true)
        formModel.value.conventionID = dropMeeting.value.length > 0 ? dropMeeting.value[0].value : null
    })
    await dropDownAttendanceStatus().then((res) => {
        dropAttendanceStatus.value = dropDownSetValueNumner(res.data, false, true)
    })
    await overViewAttendance(formModel.value.conventionID).then((res) => {
        overview.value = res.data
    })
    await onRefresh()
}
init()
</script>

<style scoped lang="scss">
.tools-wrapper {
    height: 202px;
    .total-wrapper {
        margin: 0 -10px;
        flex-shrink: 0;
        > div {
            flex: 1;
            height: 100px;
            margin: 0 10px;
            padding: 22px 34px;
            border-radius: 4px;
            box-sizing: border-box;
            line-height: 1;
            font-size: 24px;
            font-weight: bold;

            > p {
                margin: 0 0 14px;
                font-weight: normal;
                font-size: 18px;
            }
            &:nth-of-type(1) {
                background: url('@/assets/images/attendance-manage/total-bg.png') no-repeat center right/cover;
                > p {
                    color: #2d57a3;
                }
            }
            &:nth-of-type(2) {
                background: url('@/assets/images/attendance-manage/finish-bg.png') no-repeat center right/cover;
                > p {
                    color: #338295;
                }
            }
            &:nth-of-type(3) {
                background: url('@/assets/images/attendance-manage/unstart-bg.png') no-repeat center right/cover;
                > p {
                    color: #a27344;
                }
            }
            &:nth-of-type(4) {
                background: url('@/assets/images/attendance-manage/leave-bg.png') no-repeat center right/cover;
                > p {
                    color: #5a7188;
                }
            }
        }
    }
}
.list-wrapper {
    height: calc(100% - 222px);
}
</style>
