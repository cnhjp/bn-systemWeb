<template>
    <el-container class="h-full">
        <el-main>
            <div class="page-seat">
                <!-- 顶部搜索 -->
                <div class="query-main">
                    <!-- 搜索菜单 -->
                    <el-form :inline="true" :model="queryForm" class="demo-form-inline">
                        <el-form-item label="会议：">
                            <el-select
                                v-model="queryForm.meeting"
                                size="small"
                                style="width: 285px"
                                :popper-append-to-body="false"
                                placeholder="请选择"
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
                                size="small"
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
                        <el-form-item>
                            <el-button
                                v-show="seatStatus === 'preview'"
                                type="primary"
                                size="small"
                                @click="openSeatLayoutDialog"
                            >
                                座位表管理
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 操作按钮 -->
                    <div>
                        <el-button type="primary" size="small" icon="Upload" @click="syncSeatNumber">
                            同步座位号
                        </el-button>
                        <el-button
                            v-show="seatStatus == 'preview'"
                            size="small"
                            type="primary"
                            icon="copy-document"
                            @click="hanldeSeatLayoutCopy"
                        >
                            复制
                        </el-button>
                        <el-button
                            v-show="seatStatus == 'preview'"
                            size="small"
                            :disabled="!queryForm.drop"
                            type="primary"
                            icon="edit"
                            @click="hanldeSeatLayoutEdit"
                        >
                            编辑
                        </el-button>
                        <el-button
                            v-show="seatStatus == 'preview'"
                            size="small"
                            :disabled="!queryForm.drop"
                            type="primary"
                            icon="download"
                            @click="handleExport"
                        >
                            导出
                        </el-button>
                        <el-button v-show="seatStatus == 'edit'" size="small" type="danger" @click="handleGiveUpEdit">
                            <svg-icon icon="fqxg" />
                            退出
                        </el-button>
                    </div>
                </div>
                <!-- 座位表 -->
                <div class="seat-layout-wrap">
                    <div v-if="showSeat" style="width: 100%; height: 100%">
                        <seat-main
                            ref="seatMain"
                            preview
                            :seatlayout-id="queryForm.drop"
                            :convention-id="queryForm.meeting"
                        />
                    </div>

                    <div v-else class="no-seat">
                        当前会议没有座位表，请点击
                        <el-button type="text" @click="openSeatLayoutDialog">座位表管理</el-button>
                        添加
                    </div>
                </div>
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
                                        <i
                                            class="el-icon-delete seat-btn btn-danger"
                                            @click="handleDelete(scope.row)"
                                        />
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
                <el-dialog
                    title="复制座位表"
                    v-model="dialogCopyVisible"
                    width="860px"
                    top="10vh"
                    :close-on-click-modal="false"
                >
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
                                <el-button
                                    slot="append"
                                    type="primary"
                                    icon="el-icon-search"
                                    @click="handleQueryLayoutPage"
                                />
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
            </div>
        </el-main>
    </el-container>
</template>

<script>
import seatMain from './components/seat-main.vue'
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

export default {
    components: {
        seatMain,
    },
    data() {
        return {
            // 当前会议列表
            meetingOptions: [],
            // 当前座位表下拉列表
            seatLayoutDropOptions: [],
            // 座位表管理弹窗
            seatLayoutDialogVisible: false,
            // 座位表编辑弹窗
            dialogSeatFormVisible: false,
            // 复制座位表弹窗
            dialogCopyVisible: false,
            // 座位表表格数据
            layoutTableData: [],
            seatFormDialogStatus: 'ADD',
            // 搜索表单
            queryForm: {
                meeting: '',
                drop: '',
            },
            // 复制座席图搜索
            copyForm: {
                conventionID: '',
                seatLayoutName: '',
                pageIndex: 1,
                pageSize: 10,
            },
            total: 0,
            // 座位表表单
            seatForm: {
                id: '',
                name: '',
                row: '',
                column: '',
            },
            rules: {
                name: [
                    { required: true, message: '请输入座位表名称', trigger: 'blur' },
                    { min: 0, max: 50, message: '最多输入50个字', trigger: 'blur' },
                ],
                row: [{ required: true, message: '请输入排数', trigger: 'blur' }],
                column: [{ required: true, message: '请输入列数', trigger: 'blur' }],
            },
            // 座席图列表
            seatTableData: [],
            seatStatus: 'preview',
            showSeat: false,
            // 勾选的要复制的座位表
            multipleSelection: [],
            // 最大表格高度
            maxCopyTableHeight: '',
            ctxWidth: 0,
            ctxHeight: 0,
            canvasDOM: null,
        }
    },
    computed: {
        sumNumber() {
            const isNanCol = isNaN(Number(this.seatForm.column))
            const isNanRow = isNaN(Number(this.seatForm.row))
            if (!isNanCol && !isNanRow) {
                return Number(this.seatForm.column) * Number(this.seatForm.row)
            } else {
                return ''
            }
        },
    },
    mounted() {
        this.setHeight()
        this.getConventionDropList()
    },
    methods: {
        syncSeatNumber() {
            this.$confirm(`确认将当前座席图中的座位号同步至参会人员信息？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$refs.seatMain.syncSeatNumber()
            })
        },
        // 布局最大值限制
        handleLayoutChange(val, type, max) {
            if (val > max) {
                ElMessage.warning(`超过最大${type}数：${max}`)
                if (type === '列') {
                    this.seatForm.column = max
                } else {
                    this.seatForm.row = max
                }
            }
        },
        // 布局输入限制
        layoutInput(type) {
            if (type === 'row') {
                this.seatForm.row = (this.seatForm.row + '').replace(/[^\d]/g, '')
            } else {
                this.seatForm.column = (this.seatForm.column + '').replace(/[^\d]/g, '')
            }
        },
        setHeight() {
            const clientHeight = document.body.clientHeight
            this.maxCopyTableHeight = parseInt(clientHeight - clientHeight * 0.1 - 240)
        },
        // 获取会议列表
        getConventionDropList() {
            conventionDrop().then((res) => {
                this.meetingOptions = res.data
                let selectMeeting = res.data.find((item) => item.selected)
                const conventionInfo = sessionStorage.getItem('conventionInfo')
                selectMeeting =
                    conventionInfo && conventionInfo !== 'undefined' ? JSON.parse(conventionInfo) : selectMeeting
                this.queryForm.meeting = selectMeeting.value || ''
                if (this.queryForm.meeting) {
                    this.getSeatLayoutDropList()
                }
            })
        },
        // 切换会议
        handleMeetingChange(val) {
            const meetInfo = this.meetingOptions.find((item) => item.value === val)
            sessionStorage.setItem('conventionInfo', JSON.stringify(meetInfo))
            sessionStorage.setItem('layoutInfo', '')
            this.getSeatLayoutDropList()
        },
        handleEditLayout(val) {
            sessionStorage.setItem('layoutInfo', val)
        },
        // 获取座位表下拉列表
        handleCloseLayoutDialog() {
            this.seatLayoutDialogVisible = false
            this.getSeatLayoutDropList()
        },
        getSeatLayoutDropList() {
            seatLayoutDropList({
                conventionId: this.queryForm.meeting,
            }).then((res) => {
                this.seatLayoutDropOptions = res.data
                if (this.seatLayoutDropOptions.length == 0) {
                    this.queryForm.drop = ''
                    this.showSeat = false
                    return
                }
                const layoutInfo = sessionStorage.getItem('layoutInfo')
                const editLayout = this.seatLayoutDropOptions.find((item) => item.value == layoutInfo)
                if (editLayout) {
                    this.queryForm.drop = editLayout.value
                } else {
                    this.queryForm.drop = this.seatLayoutDropOptions[0].value
                }
                sessionStorage.setItem('layoutInfo', this.queryForm.drop)
                this.showSeat = true
            })
        },
        // 打开座位表管理
        openSeatLayoutDialog() {
            if (this.queryForm.meeting) {
                seatLayoutList({
                    conventionId: this.queryForm.meeting,
                }).then((res) => {
                    this.seatLayoutDialogVisible = true
                    this.seatTableData = res.data
                })
            } else {
                ElMessage.warning('请先选择会议')
            }
        },
        // 获取座位表列表
        getSeatLayoutList() {
            seatLayoutList({
                conventionId: this.queryForm.meeting,
            }).then((res) => {
                this.seatTableData = res.data
                this.seatLayoutDialogVisible = true
            })
        },
        // 删除座位表
        handleDelete(row) {
            this.$confirm(`是否确认删除${row.layoutName}座位表？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    deleteSeatLayout({
                        id: row.seatLayoutID,
                    }).then((res) => {
                        this.getSeatLayoutList()
                        this.getSeatLayoutDropList()
                        ElMessage.success('删除成功')
                    })
                })
                .catch(() => {})
        },
        // 打开复制座位表弹窗
        hanldeSeatLayoutCopy() {
            this.dialogCopyVisible = true
            this.handleQueryLayoutPage()
            this.$nextTick(() => {
                this.handleQueryLayoutPage()
            })
        },
        // 搜索根据会议/名称座位表
        handleQueryLayoutPage() {
            this.copyForm.pageIndex = 1
            this.getSeatLayoutPage()
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
        },
        // 获取会议座席图列表
        getSeatLayoutPage() {
            seatPage({
                conventionID: this.copyForm.conventionID || 0,
                seatLayoutName: this.copyForm.seatLayoutName,
                // WithoutConventionID: this.queryForm.meeting,
                pageIndex: this.copyForm.pageIndex,
                pageSize: this.copyForm.pageSize,
            }).then((res) => {
                this.layoutTableData = res.data.rows
                this.total = res.data.total
            })
        },
        // 分页切换选中
        getRowKeys(row) {
            return row.seatLayoutID
        },
        // 每页条数变化
        handleSizeChange(val) {
            this.copyForm.pageSize = val
            this.getSeatLayoutPage()
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.copyForm.pageIndex = val
            this.getSeatLayoutPage()
        },
        // 复制座位表
        submitCopySeat() {
            const seatLayoutIdList = this.multipleSelection.map((item) => item.seatLayoutID)
            if (seatLayoutIdList.length == 0) {
                ElMessage.success('请选择要复制的座位表')
                return
            }
            seatCopy({
                seatLayoutIdList,
                conventionID: this.queryForm.meeting,
            }).then((res) => {
                this.dialogCopyVisible = false
                this.getSeatLayoutDropList()
                ElMessage.success('复制成功')
            })
        },
        // 编辑座位表
        handleEdit(row) {
            this.seatFormDialogStatus = 'EDIT'
            this.dialogSeatFormVisible = true
            this.seatForm.name = row.layoutName
            this.seatForm.row = row.row
            this.seatForm.column = row.column
            this.seatForm.id = row.seatLayoutID
        },
        // 新增座位表
        hanldeAddSeat() {
            this.seatFormDialogStatus = 'ADD'
            this.dialogSeatFormVisible = true
        },
        // 取消新增/修改
        handleCancelSeatDialog() {
            this.$refs.seatForm.resetFields()
            this.dialogSeatFormVisible = false
        },
        // 新增/修改座位表
        handleSeatDialogsubmit() {
            this.$refs.seatForm.validate((valid) => {
                if (valid) {
                    if (this.seatFormDialogStatus == 'ADD') {
                        addSeatLayout({
                            conventionID: this.queryForm.meeting,
                            seatLayoutID: 0,
                            layoutName: this.seatForm.name,
                            column: this.seatForm.column,
                            row: this.seatForm.row,
                        }).then((res) => {
                            this.dialogSeatFormVisible = false
                            this.$refs.seatForm.resetFields()
                            sessionStorage.setItem('layoutInfo', '')
                            this.handleCloseLayoutDialog()
                            ElMessage.success('新增成功')
                        })
                    } else {
                        updateSeatLayout({
                            conventionID: this.queryForm.meeting,
                            seatLayoutID: this.seatForm.id,
                            layoutName: this.seatForm.name,
                            column: this.seatForm.column,
                            row: this.seatForm.row,
                        }).then((res) => {
                            this.dialogSeatFormVisible = false
                            this.getSeatLayoutList()
                            this.$refs.seatForm.resetFields()
                            ElMessage.success('修改成功')
                        })
                    }
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 座位表编辑
        hanldeSeatLayoutEdit() {
            // this.seatStatus = "edit";
            sessionStorage.setItem('layoutInfo', this.queryForm.drop)
            this.$router.push({
                name: 'seat-layout',
                query: {
                    id: this.queryForm.drop,
                    conventionId: this.queryForm.meeting,
                },
            })
        },
        // 修改座位表状态
        statusChang({ seatStatus }) {
            this.seatStatus = seatStatus
        },
        // 放弃修改
        handleGiveUpEdit() {
            this.$refs.seat.handeGiveUpEdit(this.queryForm.drop)
        },
        // 导出座位表
        handleExport() {
            this.$refs.seatMain.exportSeat()
        },
        // 点击行触发，选中或不选中复选框
        handleRowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row)
            // 获取当前选中的数据
            const _selectData = this.$refs.multipleTable.selection
            this.handleSelectionChange(_selectData)
        },
        // 选中所需要复制的会议
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        // 保存座位表序号
        saveSortIndex(row) {
            if (row.sortIndex == 0) {
                row.sortIndex = ''
                this.openSeatLayoutDialog()
                return
            }
            saveSeatSortNum({ id: row.seatLayoutID, sortIndex: row.sortIndex })
        },
    },
}
</script>

<style lang="scss" scoped>
.page-seat {
    width: 100%;
    height: 100%;

    .seat-layout-wrap {
        height: calc(100% - 70px);
        position: relative;
    }

    .no-seat {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-button {
            font-size: 20px;
        }
    }

    .query-main {
        display: flex;
        justify-content: space-between;
    }

    .pagination-wrap {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;

        .el-pagination {
            margin-top: 10px;
            display: flex;
            align-items: center;
            padding: 2px 5px;
            height: 32px;
        }
    }

    .my-dialog {
        .add-button {
            margin-bottom: 10px;
        }

        .seat-btn-wrap {
            display: flex;
        }

        .seat-btn {
            font-size: 20px;
            margin-right: 10px;
            cursor: pointer;
            color: var(--theme);
        }

        .btn-danger {
            color: #f56c6c;
        }
    }
}
::v-deep {
    .el-select-dropdown__item {
        max-width: 285px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>

<style lang="scss">
.my-dialog {
    .el-dialog__body {
        padding-top: 15px;
    }
}
</style>
