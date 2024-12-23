<template>
    <el-container class="h-full">
        <!-- 顶部搜索 -->
        <el-header class="flex-row flex-align-center flex-wrap">
            <!-- 搜索菜单 -->
            <el-form :model="queryForm" class="mr-4 whitespace-nowrap" inline>
                <el-form-item label="会议：">
                    <el-select
                        v-model="queryForm.meeting"
                        style="width: 285px"
                        placeholder="请选择"
                        :popper-append-to-body="false"
                        :disabled="seatStatus === 'edit'"
                        @change="handleMeetingChange"
                    >
                        <el-option
                            v-for="meeting in meetingOptions"
                            :key="meeting.value"
                            :label="meeting.label"
                            :value="meeting.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="当前座位表：">
                    <el-select
                        v-model="queryForm.drop"
                        placeholder="请选择"
                        :disabled="seatStatus === 'edit'"
                        @change="handleEditLayout"
                    >
                        <el-option
                            v-for="drop in seatLayoutDropOptions"
                            :key="drop.value"
                            :label="drop.label"
                            :value="drop.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button v-show="seatStatus === 'preview'" type="primary" @click="openSeatLayoutDialog">
                        座位表管理
                    </el-button>
                </el-form-item>
            </el-form>
            <!-- 操作按钮 -->
            <div class="whitespace-nowrap">
                <el-button type="primary" :icon="Upload" @click="syncSeatNumber">同步座位号</el-button>
                <el-button
                    v-show="seatStatus == 'preview'"
                    type="primary"
                    :icon="Document"
                    @click="hanldeSeatLayoutCopy"
                >
                    复制
                </el-button>
                <el-button
                    v-show="seatStatus == 'preview'"
                    :disabled="!queryForm.drop"
                    type="primary"
                    :icon="Edit"
                    @click="hanldeSeatLayoutEdit"
                >
                    编辑
                </el-button>
                <el-button
                    v-show="seatStatus == 'preview'"
                    :disabled="!queryForm.drop"
                    type="primary"
                    :icon="Download"
                    @click="handleExport"
                >
                    导出
                </el-button>
                <el-button v-show="seatStatus == 'edit'" type="danger" @click="handleGiveUpEdit">
                    <svg-icon icon-class="fqxg" />
                    退出
                </el-button>
            </div>
        </el-header>
        <!-- 座位表 -->
        <el-main>
            <div v-if="showSeat" class="wh-full">
                <seat-main ref="seatMain" preview :seatlayout-id="queryForm.drop" :convention-id="queryForm.meeting" />
            </div>
            <div v-else class="no-seat">
                <span>当前会议没有座位表，请点击</span>
                <el-link type="primary" link @click="openSeatLayoutDialog">座位表管理</el-link>
                <span>添加</span>
            </div>
        </el-main>
    </el-container>

    <!-- 座位表管理 -->
    <el-dialog
        custom-class="my-dialog"
        title="座位表管理"
        v-model="seatLayoutDialogVisible"
        width="500px"
        :close-on-click-modal="false"
    >
        <div>
            <el-button
                size="small"
                plain
                icon="el-icon-circle-plus-outline"
                class="add-button"
                type="primary"
                style="float: right"
                @click="hanldeAddSeat"
            >
                添加座位表
            </el-button>
            <el-table :data="seatTableData" border style="width: 100%">
                <el-table-column prop="sortIndex" label="序号" width="120px">
                    <template slot-scope="scope">
                        <el-input
                            v-model="scope.row.sortIndex"
                            maxlength="3"
                            @blur="saveSortIndex(scope.row)"
                            @input="scope.row.sortIndex = scope.row.sortIndex.replace(/[^\d]/g, '')"
                        />
                    </template>
                </el-table-column>
                <el-table-column prop="layoutName" label="座位表名称" />
                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <div class="seat-btn-wrap">
                            <i class="el-icon-delete seat-btn btn-danger" @click="handleDelete(scope.row)" />
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
    <!-- 新增/修改座位表 -->
    <el-dialog
        title="新增座位表"
        v-model="dialogSeatFormVisible"
        width="400px"
        :before-close="handleCancelSeatDialog"
        :close-on-click-modal="false"
    >
        <el-form ref="seatForm" :model="seatForm" label-width="95px" :rules="rules">
            <el-form-item label="座位表名称" prop="name">
                <el-input v-model="seatForm.name" autocomplete="off" placeholder="请输入座位表名称" />
            </el-form-item>
            <el-form-item label="座位排数" prop="row">
                <el-input
                    v-model="seatForm.row"
                    maxlength="2"
                    placeholder="请输入排数"
                    @input="layoutInput('row')"
                    @change="() => handleLayoutChange(seatForm.row, '行', 80)"
                />
            </el-form-item>
            <el-form-item label="座位列数" prop="column">
                <el-input
                    v-model="seatForm.column"
                    maxlength="2"
                    placeholder="请输入列数"
                    @input="layoutInput('column')"
                    @change="() => handleLayoutChange(seatForm.column, '列', 80)"
                />
            </el-form-item>
            <el-form-item label="总人数">
                <el-input v-model="sumNumber" autocomplete="off" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancelSeatDialog">取 消</el-button>
            <el-button type="primary" @click="handleSeatDialogsubmit">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 复制座位表 -->
    <el-dialog title="复制座位表" v-model="dialogCopyVisible" width="860px" top="10vh" :close-on-click-modal="false">
        <el-form :inline="true" :model="copyForm">
            <el-form-item label="会议：">
                <el-select
                    v-model="copyForm.conventionID"
                    size="small"
                    placeholder="请选择"
                    @change="handleQueryLayoutPage"
                >
                    <el-option label="全部" value="0" />
                    <el-option
                        v-for="meeting in meetingOptions"
                        :key="meeting.value"
                        :label="meeting.label"
                        :value="meeting.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="copyForm.seatLayoutName" size="small" placeholder="座位表名称">
                    <el-button slot="append" type="primary" icon="el-icon-search" @click="handleQueryLayoutPage" />
                </el-input>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="layoutTableData"
            border
            :max-height="maxCopyTableHeight + 'px'"
            style="width: 100%"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
        >
            <el-table-column type="selection" reserve-selection width="50" />
            <el-table-column prop="conventionName" label="会议名称" />
            <el-table-column prop="conventionTime" label="会议时间" width="180">
                <template slot-scope="scope">
                    {{ scope.row.conventionTime | formatDate('YYYY-MM-DD HH:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="seatLayoutName" label="座位表名称" width="220" />
        </el-table>
        <div class="pagination-wrap">
            <el-pagination
                :current-page="copyForm.PageIndex"
                :page-sizes="[10, 20, 50]"
                :page-size="copyForm.pageSize"
                small
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCopyVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitCopySeat">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { Upload, Document, Edit, Download } from '@element-plus/icons-vue'
import SeatSheet from './components/seat-sheet.vue'
import {
    conventionDrop,
    seatLayoutDropList,
    seatLayoutList,
    addSeatLayout,
    updateSeatLayout,
    deleteSeatLayout,
    seatPage,
    seatCopy,
    saveSeatSortNum,
} from '@/api/seat'

const queryForm = ref({
    meeting: '',
    drop: '',
})
const seatStatus = ref('preview')
/** 当前会议列表 */
const meetingOptions = ref([])
/** 当前座位表下拉列表 */
const seatLayoutDropOptions = ref([])
const showSeat = ref(false)
/** 座位表管理弹窗 */
const seatLayoutDialogVisible = ref(false)
/** 座席图列表 */
const seatTableData = ref([])
/** 复制座位表弹窗 */
const dialogCopyVisible = ref(false)
/** 复制座席图搜索 */
const copyForm = ref({
    conventionID: '',
    seatLayoutName: '',
    pageIndex: 1,
    pageSize: 10,
})
/** 座位表表格数据 */
const layoutTableData = ref([])
const total = ref(0)
const seatFormDialogStatus = ref('ADD')
/** 座位表编辑弹窗 */
const dialogSeatFormVisible = ref(false)

const multipleTable = ref(null)
const seatMain = ref(null)
const seat = ref(null)

/** 切换会议事件 */
const handleMeetingChange = (val) => {
    const meetInfo = meetingOptions.value.find((item) => item.value === val)
    sessionStorage.setItem('conventionInfo', JSON.stringify(meetInfo))
    sessionStorage.setItem('layoutInfo', '')
    getSeatLayoutDropList()
}
const handleEditLayout = (val) => {
    sessionStorage.setItem('layoutInfo', val)
}
// 打开座位表管理
const openSeatLayoutDialog = () => {
    if (queryForm.value.meeting) {
        seatLayoutList({
            conventionId: queryForm.value.meeting,
        }).then((res) => {
            seatLayoutDialogVisible.value = true
            seatTableData.value = res.data
        })
    } else {
        ElMessage.warning('请先选择会议')
    }
}
// 打开复制座位表弹窗
const hanldeSeatLayoutCopy = () => {
    dialogCopyVisible.value = true
    handleQueryLayoutPage()
    nextTick(() => {
        handleQueryLayoutPage()
    })
}
/** 搜索根据会议/名称座位表 */
const handleQueryLayoutPage = () => {
    copyForm.value.pageIndex = 1
    getSeatLayoutPage()
    multipleTable.value && multipleTable.value.clearSelection()
}
/** 座位表编辑 */
const hanldeSeatLayoutEdit = () => {
    // seatStatus.value = "edit";
    sessionStorage.setItem('layoutInfo', queryForm.value.drop)
    useRouter().push({
        name: 'seat-layout',
        query: {
            id: queryForm.value.drop,
            conventionId: queryForm.value.meeting,
        },
    })
}
/** 获取座位表选项 */
const getSeatLayoutDropList = () => {
    seatLayoutDropList({
        conventionId: queryForm.value.meeting,
    }).then((res) => {
        seatLayoutDropOptions.value = res.data
        if (seatLayoutDropOptions.value.length == 0) {
            queryForm.value.drop = ''
            showSeat.value = false
            return
        }
        const layoutInfo = sessionStorage.getItem('layoutInfo')
        const editLayout = seatLayoutDropOptions.value.find((item) => item.value == layoutInfo)
        if (editLayout) {
            queryForm.value.drop = editLayout.value
        } else {
            queryForm.value.drop = seatLayoutDropOptions.value[0].value
        }
        sessionStorage.setItem('layoutInfo', queryForm.value.drop)
        showSeat.value = true
    })
}
/** 获取会议座席图列表 */
const getSeatLayoutPage = () => {
    seatPage({
        conventionID: copyForm.value.conventionID || 0,
        seatLayoutName: copyForm.value.seatLayoutName,
        // WithoutConventionID: queryForm.value.meeting,
        pageIndex: copyForm.value.pageIndex,
        pageSize: copyForm.value.pageSize,
    }).then((res) => {
        layoutTableData.value = res.data.rows
        total.value = res.data.total
    })
}
/** 导出座位表 */
const handleExport = () => {
    seatMain.value.exportSeat()
}
/** 同步座位号 */
const syncSeatNumber = () => {
    ElMessageBox.confirm('确认将当前座席图中的座位号同步至参会人员信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            seatMain.value.syncSeatNumber()
        })
        .catch(() => {})
}
/** 放弃修改 */
const handleGiveUpEdit = () => {
    seat.value.handeGiveUpEdit(queryForm.value.drop)
}
/** 新增座位表 */
const hanldeAddSeat = () => {
    seatFormDialogStatus.value = 'ADD'
    dialogSeatFormVisible.value = true
}
</script>

<style lang="scss" scoped>
.no-seat {
    .el-link {
        font-size: 1.4em;
        vertical-align: baseline;
        margin: 0 0.2em;
    }
}
</style>
