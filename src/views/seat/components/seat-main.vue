<template>
    <div v-if="loaded" class="layout-container" :class="{ 'full-screen': isFullScreen }">
        <div v-if="!preview" class="layout-container-operate">
            <div class="operate-left">
                <div class="history-icon" :class="{ disabled: !hasBack }">
                    <svg-icon icon="prev" @click="getHistory(-1)" />
                </div>
                <div class="history-icon" :class="{ disabled: !hasPrev }">
                    <svg-icon icon="next" @click="getHistory(1)" />
                </div>
                <el-input
                    ref="searchRef"
                    v-model="searchName"
                    placeholder="查找人员"
                    style="width: 120px; margin: 0 20px 0 10px"
                    prefix-icon="el-icon-search"
                    clearable
                    @clear="handleClear"
                    @keyup.enter.native.prevent="handleSearch"
                    @focus="inputStatus = true"
                    @blur="inputStatus = false"
                />
                <el-dropdown
                    size="small"
                    trigger="click"
                    style="margin-right: 20px; cursor: pointer"
                    :disabled="selectedSeats.length == 0"
                >
                    <el-button type="text" :disabled="selectedSeats.length == 0">
                        <div class="top-tool" :class="{ disable: selectedSeats.length == 0 }" style="margin-right: 0">
                            <svg-icon icon="zuoweihao" style="width: 24px; height: 24px" />
                            <span>生成座位号</span>
                        </div>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <div class="operate-tools-item" @click="renderNumber">从左到右</div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="operate-tools-item" @click="renderNumberReverse">从右到左</div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="operate-tools-item" @click="renderNumberLeft">
                                当前座位为中心，左侧偶数，右侧奇数
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="operate-tools-item" @click="renderNumberRight">
                                当前座位为中心，左侧奇数，右侧偶数
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="text" :disabled="!fixedDisabled">
                    <div class="top-tool" :class="{ disable: !fixedDisabled }" @click="handleFixed('fixed')">
                        <svg-icon icon="guding" style="width: 24px; height: 24px" />
                        <span>固定人员</span>
                    </div>
                </el-button>
                <el-button type="text" :disabled="!unFixedDisabled">
                    <div class="top-tool" :class="{ disable: !unFixedDisabled }" @click="handleFixed('cancelFixed')">
                        <svg-icon icon="quxiaoguding" style="width: 24px; height: 24px" />
                        <span>取消固定</span>
                    </div>
                </el-button>
                <el-button type="text" :disabled="!selectedSeats.find((seat) => !seat.enable)">
                    <div
                        class="top-tool"
                        :class="{ disable: !selectedSeats.find((seat) => !seat.enable) }"
                        @click="enableSeat"
                    >
                        <svg-icon icon="enable-seat" style="width: 24px; height: 24px" />
                        <span>启用座位</span>
                    </div>
                </el-button>
                <el-button type="text" :disabled="!selectedSeats.find((seat) => seat.enable)">
                    <div
                        class="top-tool"
                        :class="{ disable: !selectedSeats.find((seat) => seat.enable) }"
                        @click="disabledSeat"
                    >
                        <svg-icon icon="disable-seat" style="width: 24px; height: 24px" />
                        <span>禁用座位</span>
                    </div>
                </el-button>
                <el-button type="text">
                    <div class="top-tool" @click="resetPosition">
                        <svg-icon icon="reset" style="width: 24px; height: 24px" />
                        <span>复位</span>
                    </div>
                </el-button>
            </div>
            <div>
                <!-- <el-button type="primary" size="small" @click="syncSeatNumber">
          同步座位号
        </el-button> -->
                <el-button type="primary" size="small" @click="changeDirection">切换座位表方向</el-button>
            </div>
        </div>

        <div
            class="layout-main"
            :style="{
                height: preview ? '100%' : 'calc(100% - 58px)',
                position: 'relative',
                top: '20px',
                left: '0',
            }"
        >
            <div ref="seatWrapper" class="ctx-main">
                <canvas
                    id="canvas"
                    class="ctx-dom"
                    :width="ctxWidth"
                    :height="ctxHeight"
                    @mousedown="mousedown"
                    @mousemove="mousemove"
                    @mouseup="mouseup"
                    @mouseout="mouseout"
                    @mouseenter="mouseenter"
                    @contextmenu.prevent="handleMenu"
                />
                <!-- 右键菜单 -->
                <div
                    v-show="menuInfo.show"
                    ref="menuBox"
                    class="contextmenu"
                    :style="{ left: menuX + 'px', top: menuY + 'px' }"
                >
                    <div v-show="menuType == 'seat'">
                        <div class="submenu">
                            <el-button type="text" class="menu-item">向上添加</el-button>
                            <div class="child-contextmenu">
                                <el-button type="text" class="menu-item" @click.stop.prevent="addRowSeat('top')">
                                    一排
                                </el-button>
                                <el-button type="text" class="menu-item" @click.stop.prevent="addTopRoad()">
                                    过道
                                </el-button>
                                <el-button type="text" class="menu-item" @click.stop="addTopSeat">座位</el-button>
                            </div>
                        </div>
                        <div class="submenu">
                            <el-button type="text" class="menu-item">向下添加</el-button>
                            <div class="child-contextmenu">
                                <el-button type="text" class="menu-item" @click.stop="addRowSeat('bottom')">
                                    一排
                                </el-button>
                                <el-button type="text" class="menu-item" @click.stop="addBottomRoad">过道</el-button>
                                <el-button type="text" class="menu-item" @click.stop="addBottomSeat">座位</el-button>
                            </div>
                        </div>
                        <div class="submenu">
                            <el-button type="text" class="menu-item">向左添加</el-button>
                            <div class="child-contextmenu">
                                <el-button type="text" class="menu-item" @click.stop="addColSeat('left')">
                                    一列
                                </el-button>
                                <el-button type="text" class="menu-item" @click.stop="addLeftRoad">过道</el-button>
                                <el-button type="text" class="menu-item" @click.stop="addLeftSeat">座位</el-button>
                            </div>
                        </div>
                        <div class="submenu menu-underline">
                            <el-button type="text" class="menu-item">向右添加</el-button>
                            <div class="child-contextmenu">
                                <el-button type="text" class="menu-item" @click.stop="addColSeat('right')">
                                    一列
                                </el-button>
                                <el-button type="text" class="menu-item" @click.stop="addRightRoad">过道</el-button>
                                <el-button type="text" class="menu-item" @click.stop="addRightSeat">座位</el-button>
                            </div>
                        </div>
                        <el-button v-show="!showDisable" type="text" class="menu-item" @click="enableSeat">
                            启用座位
                        </el-button>
                        <el-button v-show="showDisable" type="text" class="menu-item" @click.stop="disabledSeat">
                            禁用座位
                        </el-button>

                        <el-button type="text" class="menu-item" @click.stop="deleteRow">删除整排</el-button>
                        <el-button type="text" class="menu-item" @click.stop="deleteCol">删除整列</el-button>
                        <el-button
                            v-show="clearPersonDisabled"
                            type="text"
                            class="menu-item"
                            @click.stop="setDisabledPerson"
                        >
                            不参与排座
                        </el-button>
                        <el-button v-show="clearPersonDisabled" type="text" class="menu-item" @click.stop="clearPerson">
                            清空人员
                        </el-button>
                        <el-button v-show="clearAreaDisabled" type="text" class="menu-item" @click.stop="clearSeatArea">
                            清空区域
                        </el-button>
                        <el-button
                            v-show="!clearAreaDisabled && !clearPersonDisabled"
                            type="text"
                            class="menu-item"
                            @click.stop="deleteSeat"
                        >
                            删除座位
                        </el-button>
                    </div>
                    <div v-show="menuType == 'road'">
                        <el-button type="text" class="menu-item" @click.stop="deleteRoad">删除过道</el-button>
                    </div>
                    <div v-show="menuType == 'order'">
                        <el-button type="text" class="menu-item" @click.stop="deleteRowForOrder">删除整排</el-button>
                    </div>
                </div>
                <!-- 右下角信息 -->
                <div class="seat-message">
                    <span>总数：{{ seatList.length }}</span>
                    <span>已排：{{ personIds.length }}</span>
                    <span>未排：{{ seatList.length - personIds.length }}</span>
                    <span v-if="!preview">选中：{{ selectedSeats.length }}</span>
                </div>
                <!-- 左下角工具栏 -->
                <div class="tools stage-tools">
                    <div class="stage-tools-item" @click="openDrag">
                        <svg-icon
                            :class="{ active: operateType == 'OFFSET' }"
                            icon="hand"
                            style="width: 20px; height: 20px"
                        />
                    </div>
                    <div class="stage-tools-item tool-underline" />
                    <div class="stage-tools-item" @click="setTransform('add')">
                        <svg-icon
                            :class="{ active: operateType == 'ADD' }"
                            icon="amplify"
                            style="width: 20px; height: 20px"
                        />
                    </div>
                    <div class="stage-tools-item" @click="setTransform('reduce')">
                        <svg-icon
                            :class="{ active: operateType == 'REDUCE' }"
                            icon="reduce"
                            style="width: 20px; height: 20px"
                        />
                    </div>
                    <div class="stage-tools-item" @click="handleFullScreen">
                        <svg-icon
                            :icon="isFullScreen ? 'cancel-screen' : 'full-screen'"
                            style="width: 20px; height: 20px"
                        />
                    </div>
                </div>
                <!-- 区域 -->
                <area-drawer
                    ref="areaDrawer"
                    :person-list="personList"
                    :person-ids="personIds"
                    :force-select.sync="forceSelect"
                    :check-center-seat="checkCenterSeat"
                    :delete-person="clearDeletePerson"
                    :set-center.sync="setCenter"
                    @areaChange="areaChange"
                    @refreshGroup="getPersonList"
                    @exchange="exchange"
                    @setSeat="setSeat"
                    @clear="areaDrawerClear"
                ></area-drawer>
                <fixed-person-dialog
                    ref="fixedPersonDialog"
                    :person-list="personList"
                    :person-ids="personIds"
                    @setFixedSeat="setFixedSeat"
                    @cancel="resetSelect"
                ></fixed-person-dialog>
                <road-set ref="roadSetRef" :seat-list="seatList" @editRoadName="editRoadName" @setRoad="setRoad" />
            </div>
        </div>
    </div>
</template>

<script>
import areaDrawer from './area-drawer.vue'
import SeatHistory from './seatHistory'
import areaList from './area-list.vue'
import fixedPersonDialog from './fixed-person-dialog.vue'
import roadSet from './road-set.vue'
import {
    savePreview,
    seatLayoutInfo,
    personList,
    saveSeat,
    updateArea,
    seatAreaList,
    setSeatDirection,
    seatAreaPersonSort,
    saveSeatToConventionperson,
} from '@/api/seat'
import {
    leftToRight,
    rightToLeft,
    leftToRightForS,
    rightToLeftForS,
    centerToRightToLeft,
    centerToLeftToRight,
} from './rule-function.js'
export default {
    components: {
        areaDrawer,
        areaList,
        fixedPersonDialog,
        roadSet,
    },
    props: {
        conventionId: {
            type: [String, Number],
            default: '',
        },
        seatlayoutId: {
            type: [String, Number],
            default: '',
        },
        preview: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loaded: false,
            // 是否打开新增区域窗口
            addDialogVisible: false,
            // 是否显示编辑区域窗口
            drawer: false,
            areaColors: [
                '#FF8080',
                '#22B14C',
                '#FFF200',
                '#00A2E8',
                '#FF7F27',
                '#A349A4',
                '#FFC90E',
                '#EFE4B0',
                '#B5E61D',
                '#99D9EA',
                '#7092BE',
                '#C8BFE7',
                '#B97A57',
                '#880015',
            ],
            // 当前选中区域
            activeArea: '',
            id: 0,
            // 查找人员名称
            searchName: '',
            // 历史记录
            seatHistory: null,
            // 单元尺寸
            singleCellSize: 20,
            // 座位基于单元尺寸
            defaultSeatWidth: 4,
            defaultSeatHeight: 2,
            seatWidthSize: 4,
            seatHeightSize: 2,
            // 边距基于单元尺寸
            paddingLeftSize: 1,
            paddingTopSize: 1,
            // 错位座位间隔距离
            intervalSize: 2,
            // 座位列表
            seatList: [],
            // 序列列表
            orderList: [],
            // 排数
            row: 1,
            // 列数
            col: 1,
            // 画布尺寸
            ctxWidth: '',
            ctxHeight: '',
            // 默认座位边框颜色
            defaultSeatBorderColor: '#d8d8d8',
            // 默认座位颜色
            defaultSeatColor: '#ffffff',
            // 默认过道颜色
            defaultRoadColor: '#cccccc',
            // 默认选中颜色
            selectedSeatColor: '#2e8cf0',
            // 菜单信息
            menuInfo: {
                show: false,
                x: 0,
                y: 0,
            },
            // 平移/缩放信息
            offsetInfo: {
                moveX: 0, // x轴拖动距离
                moveY: 0, // Y轴拖动距离
                scale: 1, // 当前缩放比例
                scaleStep: 0.2, // 每次缩放大小
                x: 0, // 已拖动的x距离
                y: 0, // 已拖动的y距离
            },
            // 鼠标起始点
            startMousePoint: {
                x: 0,
                y: 0,
            },
            // 能否平移
            candrag: false,
            // 画布
            ctx: null,
            // 选中的座位列表
            selectedSeats: [],
            // 点选座位
            // pointSeat: null,
            // 过道列表
            roadList: [],
            // 操作类型
            operateType: '',
            // 是否按下ctrl
            ctrlLock: false,
            // 上次已经选中的座位id
            oldSelectIds: [],
            // 选取类型  add 增加  reduce 剪切
            selectStatus: 'add',
            // 鼠标按下位置
            pointerArea: '',
            // 按住ctrl时画选区
            ctrlSelectPath: null,
            // 人员列表
            personList: [],
            // 区域列表
            areaList: [],
            // 已设置的区域
            oldSettedArea: {},
            // 强制选取
            forceSelect: false,
            // 是否全屏操作
            isFullScreen: false,
            // 是否切换了方向
            isDirection: false,
            // 座位号规则类型
            arrangeStatus: 1,
            // 设置固定座位状态
            inputStatus: false,
            seatStatus: '',
            menuDistanceX: 0,
            menuDistanceY: 0,
            menuX: 0,
            menuY: 0,
            menuType: '',
            layoutName: '',
            isEditRoadName: false,
            setCenter: false,
        }
    },
    computed: {
        personIds() {
            const ids = []
            this.seatList.forEach((seat) => {
                if (seat.personId) {
                    ids.push(seat.personId)
                }
            })
            return ids
        },
        hasPrev() {
            return this.seatHistory && this.seatHistory.hasPrev()
        },
        hasBack() {
            return this.seatHistory && this.seatHistory.hasBack()
        },
        fixedDisabled() {
            return this.selectedSeats.length == 1 && this.selectedSeats[0].areaId != 1000
        },
        unFixedDisabled() {
            return this.selectedSeats.length == 1 && this.selectedSeats[0].areaId == 1000
        },
        showDisable() {
            return this.selectedSeats.length == 1 && this.selectedSeats[0].enable
        },
        clearPersonDisabled() {
            return this.selectedSeats.length == 1 && this.selectedSeats[0].name && this.selectedSeats[0].areaId != 1000
        },
        clearAreaDisabled() {
            return (
                this.selectedSeats.length == 1 &&
                this.selectedSeats[0].name == '' &&
                this.selectedSeats[0].areaId != '' &&
                this.selectedSeats[0].areaId != 1000
            )
        },
    },
    watch: {
        seatlayoutId() {
            this.init()
        },
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keydown)
        document.removeEventListener('keyup', this.keyup)
    },
    mounted() {
        this.init()
        if (!this.preview) {
            document.addEventListener('keydown', this.keydown)
            document.addEventListener('keyup', this.keyup)
        }
    },
    methods: {
        init() {
            this.seatList = []
            this.areaList = []
            this.orderList = []
            this.roadList = []
            this.oldSelectIds = []
            this.oldSettedArea = {}
            this.getAreaList()
            this.getSeatInfo()
            this.getPersonList()
        },
        syncSeatNumber() {
            saveSeatToConventionperson({
                seatlayoutId: this.seatlayoutId,
            }).then((res) => {
                this.$message.success('同步成功')
            })
        },
        editRoadName(status) {
            this.isEditRoadName = status
        },
        // 设置过道
        setRoad(data) {
            const road = this.roadList.find((road) => data.id == road.id)
            road.x = data.startCol - 1
            road.y = data.startRow - 1
            road.rowIndex = data.endRow
            road.colIndex = data.endCol
            road.name = data.name
            this.$refs.roadSetRef.getBoundary(road)
            this.render()
            this.addHistory()
            this.saveAll()
        },
        // 切换座位表方向
        changeDirection() {
            const widthSize = this.seatWidthSize
            this.seatWidthSize = this.seatHeightSize
            this.seatHeightSize = widthSize
            this.isDirection = !this.isDirection
            setSeatDirection({
                seatLayoutId: this.seatlayoutId,
                isVertical: this.isDirection,
            })
            this.render()
        },
        areaDrawerClear() {
            this.activeArea = ''
            this.setCenter = false
            this.forceSelect = false
        },
        // 全屏
        handleFullScreen() {
            this.isFullScreen = !this.isFullScreen
        },
        // 人员搜索
        handleSearch() {
            if (!this.searchName) {
                this.$message.error('输入不能为空')
                return
            }
            const searchSeat = this.seatList.find((seat) => {
                return seat.name == this.searchName
            })
            if (searchSeat) {
                searchSeat.selected = true
                this.selectedSeats = [searchSeat]
                this.render()
            } else {
                this.$message({
                    message: `已排座位人员中无 ‘${this.searchName}’`,
                    type: 'warning',
                })
            }
        },
        // 固定/取消固定人员
        handleFixed(status) {
            if (this.selectedSeats.length > 1) {
                return
            }
            const pointSeat = this.selectedSeats[0]
            // 设置固定座
            if (status === 'fixed') {
                if (!pointSeat.enable) {
                    this.$message.warning('座位已禁用，请启用')
                    return
                }
                if (pointSeat.personId) {
                    pointSeat.areaId = 1000
                } else {
                    pointSeat.selected = true
                    this.selectedSeats = [pointSeat]
                    this.$refs.fixedPersonDialog.open()
                    this.inputStatus = true
                    return
                }
            } else if (status === 'cancelFixed') {
                if (pointSeat.areaId == 1000) {
                    pointSeat.areaId = ''
                    pointSeat.name = ''
                    pointSeat.personId = ''
                } else {
                    return
                }
            }
            this.getOldSettedArea()
            this.addHistory()
            this.render()
            this.saveAll()
        },
        // 删除人员
        clearDeletePerson(personIds) {
            const clearSeat = this.seatList.filter((seat) => personIds.includes(seat.personId))
            clearSeat.forEach((seat) => {
                seat.personId = ''
                seat.name = ''
            })
            this.addHistory()
            this.render()
            this.saveAll()
        },
        // 清空搜索人员
        handleClear() {
            if (this.selectedSeats.length > 0) {
                this.selectedSeats.forEach((seat) => {
                    seat.selected = false
                })
                this.selectedSeats = []
            }
            this.render()
        },
        // 初始化canvas
        initCtx(cellList) {
            const width = this.row < 25 ? 52 : this.row * 2 + 2
            const height = this.col < 25 ? 52 : this.col * 2 + 2
            this.ctxWidth = this.defaultSeatWidth * this.singleCellSize * width
            this.ctxHeight = this.defaultSeatWidth * this.singleCellSize * height
            this.canvasDOM = document.querySelector('#canvas')
            this.ctx = this.canvasDOM.getContext('2d')
            if (this.preview) {
                this.operateType = 'OFFSET'
                this.canvasDOM.style.cursor = 'grab'
            }
            this.seatHistory = new SeatHistory()

            if (cellList.length > 0) {
                const seatList = cellList.filter((cell) => cell.seatType == 1 || cell.seatType == 4)
                this.seatList = seatList.sort((a, b) => {
                    const aNum = Number(a.rowIndex) * 10 + Number(a.colIndex)
                    const bNum = Number(b.rowIndex) * 10 + Number(b.colIndex)
                    return aNum - bNum
                })
                this.getOldSettedArea()
                this.orderList = cellList.filter((cell) => cell.seatType == 2)
                this.roadList = cellList.filter((cell) => cell.seatType == 3)

                this.$nextTick(() => {
                    this.render()
                    this.addHistory()
                })
            } else {
                this.$nextTick(() => {
                    this.initSeat()
                    this.initOrder()
                    this.render()
                    this.addHistory()
                    this.saveAll()
                })
            }
        },
        // 缓存老的状态
        getOldSettedArea(needCompare = false) {
            const oldSettedAreaObj = {}
            this.seatList.forEach((seat) => {
                oldSettedAreaObj[seat.id] = {
                    areaId: seat.areaId,
                    personId: seat.personId,
                    name: seat.name,
                    seatType: seat.seatType,
                }
            })
            if (needCompare) {
                const newStr = JSON.stringify(oldSettedAreaObj)
                const oldStr = JSON.stringify(this.oldSettedArea)
                if (newStr != oldStr) {
                    this.oldSettedArea = oldSettedAreaObj
                    return true
                } else {
                    return false
                }
            } else {
                this.oldSettedArea = oldSettedAreaObj
            }
        },
        // 保存全量坐席图
        saveAll() {
            const orderList = this.orderList.map((order) => ({
                personId: 0,
                enable: true,
                name: order.name,
                x: order.x,
                y: order.y,
                number: 0,
                colIndex: order.colIndex,
                rowIndex: order.rowIndex,
                areaId: 0,
                seatType: 2,
            }))
            const roadList = this.roadList.map((road) => ({
                personId: 0,
                enable: true,
                name: road.name,
                x: road.x,
                y: road.y,
                number: 0,
                colIndex: road.colIndex,
                rowIndex: road.rowIndex,
                areaId: 0,
                seatType: 3,
            }))
            const seatList = this.seatList.map((seat) => ({
                personId: seat.personId || 0,
                enable: seat.enable,
                name: seat.name,
                x: seat.x,
                y: seat.y,
                number: seat.number,
                colIndex: seat.colIndex,
                rowIndex: seat.rowIndex,
                areaId: seat.areaId || 0,
                seatType: seat.seatType,
            }))
            const data = orderList.concat(roadList).concat(seatList)
            if (data.length == 0) {
                return
            }

            saveSeat({
                seatlayoutId: this.seatlayoutId,
                seatList: data,
            }).then((res) => {
                this.$emit('saveTime', new Date())
            })
        },
        handleDelete() {
            this.deleteSeat()
            this.deleteRoad()
        },
        keydown(e) {
            if (this.inputStatus) {
                return
            }
            if (e.code == 'Backspace') {
                this.deleteSeat()
                this.deleteRoad()
            }
            if (e.code == 'ArrowLeft') {
                this.adjustSeatOfLeft()
            }
            if (e.code == 'ArrowRight') {
                this.adjustSeatOfRight()
            }
            if (e.code == 'Space') {
                this.operateType = 'OFFSET'
                this.canvasDOM.style.cursor = 'grab'
            }
            if (e.code == 'ControlLeft') {
                this.ctrlLock = true
            }
        },
        keyup(e) {
            e.preventDefault()
            if (e.code == 'ControlLeft') {
                this.ctrlLock = false
            }
            if (e.code == 'Space') {
                this.operateType = ''
                this.candrag = false
                this.canvasDOM.style.cursor = 'cell'
            }
        },
        // 删除人员
        clearPerson() {
            this.selectedSeats.forEach((seat) => {
                if (seat.areaId != 1000) {
                    seat.personId = ''
                    seat.name = ''
                } else {
                    this.$message.warning(
                        `${seat.rowIndex}排${seat.colIndex}号 ${seat.name}，为固定人员，不可删除，请取消固定`,
                    )
                }
            })
            this.menuInfo.show = false
            this.addHistory()
            this.saveAll()
            this.resetSelect()
        },
        // 不参与排座
        setDisabledPerson() {
            const pointerSeat = this.selectedSeats[0]
            const activeArea = this.areaList.find((area) => area.seatAreaId == pointerSeat.areaId)
            const areaPersonGroup = this.personList.find((group) => group.id == activeArea.personGroupId)
            const personList = areaPersonGroup.personList
            const nowPerson = personList.find((p) => p.personId == pointerSeat.personId)
            nowPerson.disabled = true
            this.menuInfo.show = false
            pointerSeat.personId = ''
            pointerSeat.name = ''

            const details = personList.map((p, index) => ({
                areaId: pointerSeat.areaId,
                personId: p.personId,
                sortIndex: index,
                personName: p.personName,
                disabled: p.disabled,
            }))
            seatAreaPersonSort({
                seatlayoutId: this.seatlayoutId,
                details,
            }).then(() => {
                this.getPersonList()
                this.resetSelect()
                this.saveAll()
                this.getOldSettedArea()
                this.seatHistory.reset()
                // this.addHistory()
            })
        },
        // 清空区域
        clearSeatArea() {
            this.selectedSeats.forEach((seat) => {
                if (seat.areaId != 1000) {
                    seat.personId = ''
                    seat.areaId = ''
                    seat.name = ''
                    seat.seatType = 1
                } else {
                    this.$message.warning(
                        `${seat.rowIndex}排${seat.colIndex}号 ${seat.name}，为固定人员，不可清空，请取消固定`,
                    )
                }
            })
            this.menuInfo.show = false
            this.addHistory()
            this.saveAll()
            this.resetSelect()
        },
        // 获取区域列表
        getAreaList() {
            seatAreaList({ seatlayoutId: this.seatlayoutId }).then((res) => {
                this.areaList = res.data
                this.render()
            })
        },
        // 检查中心位置
        checkCenterSeat() {
            const areaSeatList = this.seatList.filter((seat) => seat.areaId == this.activeArea)
            const rowNumberSet = new Set(areaSeatList.map((seat) => seat.rowIndex))
            const rowNumber = Array.from(rowNumberSet)
            let checkResult = true
            for (let i = 0; i < rowNumber.length; i++) {
                const num = rowNumber[i]
                const centerSeat = areaSeatList.find((seat) => seat.rowIndex == num && seat.seatType == 4)
                if (!centerSeat) {
                    checkResult = false
                    this.$message.warning(`第${num}排未设置中心位置`)
                    break
                }
            }
            return checkResult
        },
        // 区域修改
        areaChange(data) {
            updateArea([
                {
                    ...data,
                    seatlayoutId: this.seatlayoutId,
                },
            ]).then((res) => {
                this.getAreaList()
            })
        },
        // 一键排座
        setSeat(activeArea = '') {
            const operateArea = activeArea || this.activeArea
            if (!operateArea) {
                this.$message.warning('请先选择区域')
                return
            }
            const area = this.areaList.find((area) => area.seatAreaId == operateArea)
            let areaSeatList = this.seatList.filter((seat) => seat.areaId == operateArea)
            areaSeatList.forEach((seat) => {
                seat.personId = ''
                seat.name = ''
            })
            if (areaSeatList.length > 0) {
                const id = area.personGroupId === 0 ? -1 : area.personGroupId
                let areaPerson = this.personList.find((group) => group.id == id).personList

                areaPerson = areaPerson.filter((p) => !this.personIds.includes(p.personId) && !p.disabled)

                switch (area.seatRule) {
                    case 0:
                        areaSeatList = leftToRight(areaSeatList)
                        break
                    case 1:
                        areaSeatList = rightToLeft(areaSeatList)
                        break
                    case 2:
                        areaSeatList = centerToLeftToRight(areaSeatList)
                        break
                    case 3:
                        areaSeatList = centerToRightToLeft(areaSeatList)
                        break
                    case 4:
                        areaSeatList = leftToRightForS(areaSeatList, this.col)
                        break
                    case 5:
                        areaSeatList = rightToLeftForS(areaSeatList, this.col)
                        break
                }
                areaSeatList.forEach((seat, index) => {
                    if (index < areaPerson.length) {
                        seat.name = areaPerson[index].personName
                        seat.personId = areaPerson[index].personId
                    }
                })
            }
            const hasChange = this.getOldSettedArea(true)
            console.log(hasChange)
            if (hasChange) {
                this.addHistory()
                this.saveAll()
                this.render()
            }
        },
        // 交换人员列表
        exchange(data, personGroupId) {
            const exchangeArea = this.areaList.find((area) => area.personGroupId == data.personGroupId)

            const needClearSeat = this.seatList.filter((seat) => {
                return (seat.areaId == data.seatAreaId || seat.areaId == exchangeArea.seatAreaId) && seat.personId
            })
            if (needClearSeat.length > 0) {
                needClearSeat.forEach((seat) => {
                    seat.name = ''
                    seat.personId = ''
                })
                this.render()
                this.getOldSettedArea()
                // this.addHistory()
            }
            this.seatHistory.reset()
            updateArea([
                {
                    ...data,
                },
                {
                    ...exchangeArea,
                    personGroupId: personGroupId,
                },
            ]).then((res) => {
                this.getAreaList()
            })
        },
        // 打开添加区域
        addArea() {
            this.addDialogVisible = true
        },
        // 打开区域设置
        openDrawer(area) {
            if (this.preview) {
                return
            }
            this.seatStatus = ''
            this.setCenter = false
            this.forceSelect = false
            if (area.seatAreaId == this.activeArea) {
                this.activeArea = ''
                this.$refs.areaDrawer.close()
            } else {
                this.activeArea = area.seatAreaId

                this.$refs.areaDrawer.open(area)
            }
            if (this.selectedSeats.length > 0) {
                this.resetSelect()
            }
            const selectedRoad = this.roadList.find((road) => road.selected)
            this.menuInfo.show = false
            if (selectedRoad) {
                selectedRoad.selected = false
                this.render()
                this.$refs.roadSetRef.close()
            }
        },
        // 获取人员列表
        getPersonList(needReset = false) {
            personList({
                conventionId: this.conventionId,
                seatLayoutId: this.seatlayoutId,
            }).then((res) => {
                this.personList = res.data
                if (needReset) {
                    this.seatHistory.reset()
                }
            })
        },
        // 获取坐席图信息
        getSeatInfo() {
            seatLayoutInfo({ id: this.seatlayoutId }).then((res) => {
                this.loaded = true
                this.$emit('getName', res.data.layoutName)
                this.row = res.data.row
                this.col = res.data.column
                this.arrangeStatus = res.data.arrangeStatus || 1
                this.layoutName = res.data.layoutName
                this.isDirection = res.data.isVertical
                if (this.isDirection) {
                    this.seatWidthSize = this.defaultSeatHeight
                    this.seatHeightSize = this.defaultSeatWidth
                } else {
                    this.seatWidthSize = this.defaultSeatWidth
                    this.seatHeightSize = this.defaultSeatHeight
                }
                this.id = 0
                const cellList = res.data.seatList.map((seat) => {
                    this.id++
                    return {
                        id: this.id,
                        ...seat,
                    }
                })
                this.$nextTick(() => {
                    this.initCtx(cellList)
                })
            })
        },
        // 每排按顺序排列座位
        renderNumber() {
            const selectY = this.selectedSeats.map((seat) => seat.y)
            const singleY = [...new Set(selectY)]
            singleY.forEach((y) => {
                const numberSeat = this.seatList.filter((seat) => seat.y == y)
                numberSeat.forEach((seat) => {
                    seat.number = seat.colIndex
                })
            })

            this.render()
            this.addHistory()
            this.saveAll()
        },
        // 每排按倒叙排列座位
        renderNumberReverse() {
            const selectY = this.selectedSeats.map((seat) => seat.y)
            const singleY = [...new Set(selectY)]
            singleY.forEach((y) => {
                const numberSeat = this.seatList.filter((seat) => seat.y == y)
                const max = numberSeat.length
                numberSeat.forEach((seat) => {
                    seat.number = max - seat.colIndex + 1
                })
            })

            this.render()
            this.addHistory()
            this.saveAll()
        },
        // 每排按中间到两边排列座位（左侧为奇数）
        renderNumberLeft() {
            const selectY = this.selectedSeats.map((seat) => seat.y)
            const singleY = [...new Set(selectY)]
            if (selectY.length > singleY.length) {
                this.$message.warning('每排只可选择一个中心座位')
                return
            }

            this.selectedSeats.forEach((pointSeat) => {
                const numberSeat = this.seatList.filter((seat) => seat.y == pointSeat.y)
                const leftNumberSeat = numberSeat.filter((seat) => seat.x < pointSeat.x)
                const rightNumberSeat = numberSeat.filter((seat) => seat.x > pointSeat.x)
                pointSeat.number = 1
                leftNumberSeat.forEach((seat) => {
                    seat.number = 2 * (pointSeat.colIndex - seat.colIndex)
                })
                rightNumberSeat.forEach((seat) => {
                    seat.number = 2 * (seat.colIndex - pointSeat.colIndex) + 1
                })
            })

            this.arrangeStatus = 3
            this.render()
            this.addHistory()
            this.saveAll()
        },
        // 每排按中间到两边排列座位（左侧为偶数）
        renderNumberRight() {
            const selectY = this.selectedSeats.map((seat) => seat.y)
            const singleY = [...new Set(selectY)]
            if (selectY.length > singleY.length) {
                this.$message.warning('每排只可选择一个中心座位')
                return
            }

            this.selectedSeats.forEach((pointSeat) => {
                const numberSeat = this.seatList.filter((seat) => seat.y == pointSeat.y)
                const leftNumberSeat = numberSeat.filter((seat) => seat.x < pointSeat.x)
                const rightNumberSeat = numberSeat.filter((seat) => seat.x > pointSeat.x)
                pointSeat.number = 1
                leftNumberSeat.forEach((seat) => {
                    seat.number = 2 * (pointSeat.colIndex - seat.colIndex) + 1
                })
                rightNumberSeat.forEach((seat) => {
                    seat.number = 2 * (seat.colIndex - pointSeat.colIndex)
                })
            })

            this.arrangeStatus = 3
            this.render()
            this.addHistory()
            this.saveAll()
        },
        // 禁用座位
        disabledSeat() {
            const enableSeat = this.selectedSeats.find((seat) => seat.enable)
            if (!enableSeat) {
                return
            }
            this.selectedSeats.forEach((seat) => {
                if (seat.areaId) {
                    seat.enable = false
                    seat.areaId = ''
                    seat.personId = ''
                    seat.name = ''
                } else {
                    seat.enable = false
                }
            })
            this.menuInfo.show = false
            this.getOldSettedArea()
            this.addHistory()
            this.saveAll()
            this.resetSelect()
        },
        // 启用座位
        enableSeat() {
            const disableSeat = this.selectedSeats.find((seat) => !seat.enable)
            if (!disableSeat) {
                return
            }
            this.selectedSeats.forEach((seat) => {
                seat.enable = true
            })
            this.menuInfo.show = false
            this.addHistory()
            this.saveAll()
            this.resetSelect()
        },
        // 向下添加座位
        addBottomSeat() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            let errorSeat = null
            let errorRoad = null
            if (pointSeat.y > this.orderList.length - 2) {
                errorSeat = pointSeat
            } else {
                errorSeat = this.seatList.find((seat) => {
                    return (
                        seat.y == pointSeat.y + 1 &&
                        (seat.x == pointSeat.x || seat.x == pointSeat.x - 0.5 || seat.x == pointSeat.x + 0.5)
                    )
                })
                const seatWidth = this.seatWidthSize * this.singleCellSize
                const seatHeight = this.seatHeightSize * this.singleCellSize
                errorRoad = this.roadList.find((road) => {
                    const ySize = road.rowIndex - road.y
                    const xSize = road.colIndex - road.x
                    const rect1 = {
                        x: road.x * seatWidth + 1,
                        y: road.y * seatHeight + 1,
                        width: seatWidth * xSize - 1,
                        height: seatHeight * ySize - 1,
                    }
                    const rect2 = {
                        x: pointSeat.x * seatWidth + 1,
                        y: (pointSeat.y + 1) * seatHeight + 1,
                        width: seatWidth - 1,
                        height: seatHeight - 1,
                    }
                    const result = this.rectCollide(rect1, rect2)
                    return result
                })
            }
            if (errorSeat || errorRoad) {
                this.$message.warning('下方座位空间不足')
            } else {
                const sameRowSeat = this.seatList.filter((seat) => seat.y == pointSeat.y + 1 && seat.x < pointSeat.x)
                this.id++
                const seatObj = {
                    id: this.id,
                    personId: '',
                    x: pointSeat.x, // X 轴位置  相对于单元格
                    y: pointSeat.y + 1, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex: sameRowSeat.length + 1, // 座位的列序号
                    rowIndex: pointSeat.rowIndex + 1, // 座位的行序号
                    areaId: '', // 改座位属于哪个区域
                    selected: false, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
                this.seatList.forEach((seat) => {
                    if (seat.y == pointSeat.y + 1 && seat.x > pointSeat.x) {
                        seat.colIndex = seat.colIndex + 1
                    }
                })
                this.seatList.push(seatObj)
                this.getOldSettedArea()
                this.render()
                this.saveAll()
                this.addHistory()
                this.menuInfo.show = false
            }
        },
        // 向上添加座位
        addTopSeat() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            let errorSeat = null
            let errorRoad = null
            if (pointSeat.y < 1) {
                errorSeat = pointSeat
            } else {
                errorSeat = this.seatList.find((seat) => {
                    return (
                        seat.y == pointSeat.y - 1 &&
                        (seat.x == pointSeat.x || seat.x == pointSeat.x - 0.5 || seat.x == pointSeat.x + 0.5)
                    )
                })
                const seatWidth = this.seatWidthSize * this.singleCellSize
                const seatHeight = this.seatHeightSize * this.singleCellSize
                errorRoad = this.roadList.find((road) => {
                    const ySize = road.rowIndex - road.y
                    const xSize = road.colIndex - road.x
                    const rect1 = {
                        x: road.x * seatWidth + 1,
                        y: road.y * seatHeight + 1,
                        width: seatWidth * xSize - 1,
                        height: seatHeight * ySize - 1,
                    }
                    const rect2 = {
                        x: pointSeat.x * seatWidth + 1,
                        y: (pointSeat.y - 1) * seatHeight + 1,
                        width: seatWidth - 1,
                        height: seatHeight - 1,
                    }
                    const result = this.rectCollide(rect1, rect2)
                    return result
                })
            }
            if (errorSeat || errorRoad) {
                this.$message.warning('上方座位空间不足')
            } else {
                const sameOrder = this.orderList.find((order) => order.y == pointSeat.y - 1)
                let rowIndex = pointSeat.rowIndex
                if (!sameOrder) {
                    this.orderList.forEach((order) => {
                        if (order.y >= pointSeat.y) {
                            order.rowIndex = order.rowIndex + 1
                        }
                    })
                    this.seatList.forEach((seat) => {
                        if (seat.y >= pointSeat.y) {
                            seat.rowIndex = seat.rowIndex + 1
                        }
                    })
                    this.orderList.splice(rowIndex, 0, {
                        id: this.id++,
                        personId: '',
                        enable: true,
                        x: 0, // X 轴位置, 1 代表一个座位宽度一半
                        y: pointSeat.y - 1, // Y 轴位置，1 代表一个座位高度
                        path: null, // 座位的路径
                        name: '', // 座位的信息
                        colIndex: 0, // 座位的列序号
                        rowIndex: rowIndex, // 座位的行序号
                        areaId: 0, // 改座位属于哪个区域
                        selected: false,
                        seatType: 2,
                    })
                } else {
                    rowIndex = rowIndex - 1
                }
                // 查找同排左侧有多少个座位，确定座位号
                const sameRowSeat = this.seatList.filter((seat) => seat.y == pointSeat.y - 1 && seat.x < pointSeat.x)
                this.id++
                const seatObj = {
                    id: this.id,
                    personId: '',
                    x: pointSeat.x, // X 轴位置  相对于单元格
                    y: pointSeat.y - 1, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex: sameRowSeat.length + 1, // 座位的列序号
                    rowIndex: rowIndex, // 座位的行序号
                    areaId: '', // 改座位属于哪个区域
                    selected: false, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
                // 右侧所有座位座位号 + 1
                this.seatList.forEach((seat) => {
                    if (seat.y == pointSeat.y - 1 && seat.x > pointSeat.x) {
                        seat.colIndex = seat.colIndex + 1
                    }
                })

                this.seatList.push(seatObj)
                this.getOldSettedArea()
                this.render()
                this.saveAll()
                this.addHistory()
                this.menuInfo.show = false
            }
        },
        // 向左添加座位
        addLeftSeat() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            let errorSeat = null
            let errorRoad = null
            if (pointSeat.x < 2) {
                errorSeat = pointSeat
            } else {
                errorSeat = this.seatList.find((seat) => {
                    return seat.y == pointSeat.y && (seat.x == pointSeat.x - 1 || seat.x == pointSeat.x - 1.5)
                })
                const seatWidth = this.seatWidthSize * this.singleCellSize
                const seatHeight = this.seatHeightSize * this.singleCellSize
                errorRoad = this.roadList.find((road) => {
                    const ySize = road.rowIndex - road.y
                    const xSize = road.colIndex - road.x
                    const rect1 = {
                        x: road.x * seatWidth + 1,
                        y: road.y * seatHeight + 1,
                        width: seatWidth * xSize - 1,
                        height: seatHeight * ySize - 1,
                    }
                    const rect2 = {
                        x: (pointSeat.x - 1) * seatWidth + 1,
                        y: pointSeat.y * seatHeight + 1,
                        width: seatWidth - 1,
                        height: seatHeight - 1,
                    }
                    const result = this.rectCollide(rect1, rect2)
                    return result
                })
            }

            if (errorSeat || errorRoad) {
                this.$message.warning('左侧座位空间不足')
            } else {
                this.id++
                const colIndex = pointSeat.colIndex
                const seatObj = {
                    id: this.id,
                    personId: '',
                    x: pointSeat.x - 1, // X 轴位置  相对于单元格
                    y: pointSeat.y, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex: colIndex, // 座位的列序号
                    rowIndex: pointSeat.rowIndex, // 座位的行序号
                    areaId: '', // 改座位属于哪个区域
                    selected: false, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
                this.seatList.forEach((seat) => {
                    if (seat.rowIndex == pointSeat.rowIndex && seat.colIndex >= colIndex) {
                        seat.colIndex = seat.colIndex + 1
                    }
                })
                this.seatList.push(seatObj)
                this.getOldSettedArea()
                this.render()
                this.saveAll()
                this.addHistory()
                this.menuInfo.show = false
            }
        },
        // 向右添加座位
        addRightSeat() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return

            let errorSeat = null
            let errorRoad = null
            errorSeat = this.seatList.find((seat) => {
                return seat.y == pointSeat.y && (seat.x == pointSeat.x + 1 || seat.x == pointSeat.x + 1.5)
            })
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            errorRoad = this.roadList.find((road) => {
                const ySize = road.rowIndex - road.y
                const xSize = road.colIndex - road.x
                const rect1 = {
                    x: road.x * seatWidth + 1,
                    y: road.y * seatHeight + 1,
                    width: seatWidth * xSize - 1,
                    height: seatHeight * ySize - 1,
                }
                const rect2 = {
                    x: (pointSeat.x + 1) * seatWidth + 1,
                    y: pointSeat.y * seatHeight + 1,
                    width: seatWidth - 1,
                    height: seatHeight - 1,
                }
                const result = this.rectCollide(rect1, rect2)
                return result
            })
            if (errorSeat || errorRoad) {
                this.$message.warning('右侧座位空间不足')
            } else {
                this.id++
                const colIndex = pointSeat.colIndex + 1
                const seatObj = {
                    id: this.id,
                    personId: '',
                    x: pointSeat.x + 1, // X 轴位置  相对于单元格
                    y: pointSeat.y, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex: colIndex, // 座位的列序号
                    rowIndex: pointSeat.rowIndex, // 座位的行序号
                    areaId: '', // 改座位属于哪个区域
                    selected: false, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
                this.seatList.forEach((seat) => {
                    if (seat.rowIndex == pointSeat.rowIndex && seat.colIndex >= colIndex) {
                        seat.colIndex = seat.colIndex + 1
                    }
                })
                this.seatList.push(seatObj)
                this.getOldSettedArea()
                this.render()
                this.saveAll()
                this.addHistory()
                this.menuInfo.show = false
            }
        },
        // 添加一列
        addColSeat(type) {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            const referenceX = pointSeat.x
            const errorX = type == 'left' ? pointSeat.x - 0.5 : pointSeat.x + 0.5
            const errprSeat = this.seatList.find((seat) => seat.x == errorX)
            if (errprSeat) {
                this.$message.warning('有座位重叠，无法添加列')
                return
            }
            const maxX = Math.max(...this.seatList.map((seat) => seat.x))
            if (maxX >= 80) {
                this.$message.warning('已达到最大列数：80')
                return
            }
            const copySeat = this.seatList.filter((seat) => seat.x == referenceX)
            const newSeats = copySeat.map((seat) => {
                const x = type == 'left' ? seat.x : seat.x + 1
                const y = seat.y
                const colIndex = seat.colIndex
                const rowIndex = seat.rowIndex
                this.id++
                return {
                    id: this.id,
                    personId: '',
                    x, // X 轴位置  相对于单元格
                    y, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex, // 座位的列序号 x
                    rowIndex, // 座位的行序号 y
                    areaId: '', // 改座位属于哪个区域
                    selected: true, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
            })

            // 需要向右移动的座位
            this.seatList.forEach((seat) => {
                if (type == 'left') {
                    if (seat.x >= referenceX) {
                        seat.x = seat.x + 1
                        seat.colIndex += 1
                    }
                } else {
                    if (seat.x > referenceX) {
                        seat.x = seat.x + 1
                        seat.colIndex += 1
                    }
                }
            })
            // 需要向右移动的过道
            this.roadList.forEach((road) => {
                if (road.x > referenceX) {
                    road.x = road.x + 1
                    road.colIndex = road.colIndex + 1
                }
            })

            this.seatList = this.seatList.concat(newSeats).sort((a, b) => {
                const aNum = Number(a.colIndex) * 100 + Number(a.rowIndex)
                const bNum = Number(b.colIndex) * 100 + Number(b.rowIndex)
                return aNum - bNum
            })
            this.selectedSeats = newSeats
            pointSeat.selected = false
            this.menuInfo.show = false
            this.getOldSettedArea()
            this.addHistory()
            this.saveAll()
            this.resetSelect()
        },
        // 删除整排
        deleteRow() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            this.$confirm('此操作将清空当前排所有数据，是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    const errorRoad = this.roadList.find((road) => pointSeat.y >= road.y && pointSeat.y < road.rowIndex)
                    if (errorRoad) {
                        this.seatList = this.seatList.filter((seat) => seat.rowIndex != pointSeat.rowIndex)
                        this.seatList.forEach((seat) => {
                            if (seat.rowIndex > pointSeat.rowIndex) {
                                seat.rowIndex = seat.rowIndex - 1
                            }
                        })
                        this.orderList = this.orderList.filter((order) => order.rowIndex != pointSeat.rowIndex)
                        this.orderList.forEach((order) => {
                            if (order.rowIndex > pointSeat.rowIndex) {
                                order.rowIndex = order.rowIndex - 1
                            }
                        })
                    } else {
                        this.selectedSeats = []
                        this.seatList = this.seatList.filter((seat) => seat.rowIndex != pointSeat.rowIndex)
                        this.orderList = this.orderList.filter((order) => order.rowIndex != pointSeat.rowIndex)
                        this.seatList.forEach((seat) => {
                            if (seat.rowIndex > pointSeat.rowIndex) {
                                seat.rowIndex = seat.rowIndex - 1
                                seat.y = seat.y - 1
                            }
                        })
                        this.roadList.forEach((road) => {
                            if (road.y > pointSeat.y) {
                                road.y = road.y - 1
                                road.rowIndex = road.rowIndex - 1
                            }
                        })

                        this.orderList.forEach((order) => {
                            if (order.rowIndex > pointSeat.rowIndex) {
                                order.rowIndex = order.rowIndex - 1
                                order.y = order.y - 1
                            }
                        })
                    }

                    this.render()
                    this.saveAll()
                    this.addHistory()
                })
                .catch(() => {})
            this.menuInfo.show = false
        },
        // 右键序号删除整排
        deleteRowForOrder() {
            this.$confirm('此操作将清空当前排所有数据，是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.selectedSeats = []
                const errorRoad = this.roadList.find(
                    (road) => this.pointerOrder.y >= road.y && this.pointerOrder.y < road.rowIndex,
                )
                if (errorRoad) {
                    this.seatList = this.seatList.filter((seat) => seat.rowIndex != this.pointerOrder.rowIndex)
                    this.seatList.forEach((seat) => {
                        if (seat.rowIndex > this.pointerOrder.rowIndex) {
                            seat.rowIndex = seat.rowIndex - 1
                        }
                    })
                    this.orderList = this.orderList.filter((order) => order.rowIndex != this.pointerOrder.rowIndex)
                    this.orderList.forEach((order) => {
                        if (order.rowIndex > this.pointerOrder.rowIndex) {
                            order.rowIndex = order.rowIndex - 1
                        }
                    })
                } else {
                    this.seatList = this.seatList.filter((seat) => seat.rowIndex != this.pointerOrder.rowIndex)
                    this.seatList.forEach((seat) => {
                        if (seat.rowIndex > this.pointerOrder.rowIndex) {
                            seat.rowIndex = seat.rowIndex - 1
                            seat.y = seat.y - 1
                        }
                    })
                    this.orderList = this.orderList.filter((order) => order.rowIndex != this.pointerOrder.rowIndex)
                    this.orderList.forEach((order) => {
                        if (order.rowIndex > this.pointerOrder.rowIndex) {
                            order.rowIndex = order.rowIndex - 1
                            order.y = order.y - 1
                        }
                    })
                    this.roadList.forEach((road) => {
                        if (road.y > this.pointerOrder.y) {
                            road.y = road.y - 1
                            road.rowIndex = road.rowIndex - 1
                        }
                    })
                }
                this.render()
                this.saveAll()
                this.addHistory()
            })
            this.menuInfo.show = false
        },
        // 删除整列
        deleteCol() {
            const pointSeat = this.selectedSeats[0]
            this.menuInfo.show = false
            if (!pointSeat) return
            const errprSeat = this.seatList.find((seat) => seat.x === pointSeat.x + 0.5 || seat.x === pointSeat.x - 0.5)
            if (errprSeat) {
                this.$message.warning('该列有错位座位，无法删除')
                return
            }

            this.$confirm('此操作将清空当前列所有座位数据，是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    const delList = this.seatList.filter((seat) => seat.x == pointSeat.x)
                    this.seatList = this.seatList.filter((seat) => seat.x != pointSeat.x)
                    const errorRoad = this.roadList.find((road) => pointSeat.x >= road.x && pointSeat.x < road.colIndex)
                    if (errorRoad) {
                        delList.forEach((delSeat) => {
                            this.seatList.forEach((seat) => {
                                if (seat.x > delSeat.x && seat.y == delSeat.y) {
                                    seat.colIndex = seat.colIndex - 1
                                }
                            })
                        })
                    } else {
                        delList.forEach((delSeat) => {
                            this.seatList.forEach((seat) => {
                                if (seat.y == delSeat.y && seat.x > delSeat.x) {
                                    seat.colIndex = seat.colIndex - 1
                                }
                            })
                        })
                        this.seatList.forEach((seat) => {
                            if (seat.x > pointSeat.x) {
                                seat.x = seat.x - 1
                            }
                        })
                        this.roadList.forEach((road) => {
                            if (road.x > pointSeat.x) {
                                road.x = road.x - 1
                                road.colIndex = road.colIndex - 1
                            }
                        })
                    }

                    this.menuInfo.show = false
                    this.resetSelect()
                    this.saveAll()
                    this.addHistory()
                })
                .catch(() => {})
        },
        // 添加一排
        addRowSeat(type) {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return

            const maxY = Math.max(...this.seatList.map((seat) => seat.y))
            if (maxY >= 80) {
                this.$message.warning('已达到最大排数：80')
                return
            }
            pointSeat.selected = false
            const referenceY = pointSeat.y
            const referenceRowIndex = pointSeat.rowIndex

            const copySeat = this.seatList.filter((seat) => seat.y == referenceY)
            const newSeats = copySeat.map((seat) => {
                this.id++
                const x = seat.x
                const y = type == 'top' ? seat.y : seat.y + 1
                const colIndex = seat.colIndex
                const rowIndex = type == 'top' ? seat.rowIndex : seat.rowIndex + 1
                return {
                    id: this.id,
                    personId: '',
                    x, // X 轴位置  相对于单元格
                    y, // Y 轴位置  相对于单元格
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex, // 座位的列序号 x
                    rowIndex, // 座位的行序号 y
                    areaId: '', // 改座位属于哪个区域
                    selected: true, // 是否选中
                    number: 0, // 座位号
                    enable: true,
                    seatType: 1,
                }
            })
            // 需要向下移动的位置
            this.seatList.forEach((seat) => {
                if (type == 'top') {
                    if (seat.y >= referenceY) {
                        seat.y = seat.y + 1
                        seat.rowIndex = seat.rowIndex + 1
                    }
                } else {
                    if (seat.y > referenceY) {
                        seat.y = seat.y + 1
                        seat.rowIndex = seat.rowIndex + 1
                    }
                }
            })
            // 需要向后移动的过道
            this.roadList.forEach((road) => {
                if (road.y > referenceY) {
                    road.y = road.y + 1
                    road.rowIndex = road.rowIndex + 1
                }
            })
            // 需要向后移动的序号
            this.orderList.forEach((order) => {
                if (type == 'top') {
                    if (order.y >= referenceY) {
                        order.y = order.y + 1
                        order.rowIndex = order.rowIndex + 1
                    }
                } else {
                    if (order.y > referenceY) {
                        order.y = order.y + 1
                        order.rowIndex = order.rowIndex + 1
                    }
                }
            })
            this.seatList = this.seatList.concat(newSeats).sort((a, b) => {
                const aNum = Number(a.colIndex) * 100 + Number(a.rowIndex)
                const bNum = Number(b.colIndex) * 100 + Number(b.rowIndex)
                return aNum - bNum
            })
            const orderRowIndex = type == 'top' ? referenceRowIndex : referenceRowIndex + 1
            this.orderList.splice(orderRowIndex, 0, {
                id: this.id++,
                personId: '',
                enable: true,
                x: 0, // X 轴位置, 1 代表一个座位宽度一半
                y: type == 'top' ? referenceY : referenceY + 1, // Y 轴位置，1 代表一个座位高度
                path: null, // 座位的路径
                name: '', // 座位的信息
                colIndex: 0, // 座位的列序号
                rowIndex: orderRowIndex, // 座位的行序号
                areaId: 0, // 改座位属于哪个区域
                selected: false,
                seatType: 2,
            })
            this.menuInfo.show = false
            this.selectedSeats = newSeats
            this.getOldSettedArea()
            this.render()
            this.saveAll()
            this.addHistory()
        },
        // 复位
        resetPosition() {
            this.canvasDOM.style.left = '0'
            this.canvasDOM.style.top = '0'
            this.offsetInfo.x = 0
            this.offsetInfo.y = 0
            this.menuDistanceX = 0
            this.menuDistanceY = 0
            this.offsetInfo.scale = 1
            this.render()
            this.menuInfo.show = false
        },
        // 打开菜单
        handleMenu(e) {
            if (this.preview) {
                return
            }
            e.preventDefault()
            this.$refs.areaDrawer.close()
            if (this.operateType == 'OFFSET') {
                return
            }
            const pointSeat = this.seatList.find((seat) => {
                return this.ctx.isPointInPath(seat.path, e.offsetX, e.offsetY)
            })
            this.seatList.forEach((seat) => {
                seat.selected = false
            })
            if (pointSeat) {
                this.roadList.forEach((road) => (road.selected = false))
                this.$refs.roadSetRef.close()
                this.menuInfo.show = true
                this.menuInfo.x = e.offsetX
                this.menuInfo.y = e.offsetY
                this.menuX = e.offsetX + this.menuDistanceX
                this.menuY = e.offsetY + this.menuDistanceY
                const maxLeft = this.$refs.seatWrapper.offsetWidth - this.$refs.menuBox.offsetWidth - 20
                const maxTop = this.$refs.seatWrapper.offsetHeight - this.$refs.menuBox.offsetHeight - 20

                this.menuX = this.menuX > maxLeft ? this.menuX - this.$refs.menuBox.offsetWidth - 10 : this.menuX
                this.menuY = this.menuY > maxTop ? this.menuY - this.$refs.menuBox.offsetHeight : this.menuY

                pointSeat.selected = true
                this.selectedSeats = [pointSeat]
                this.menuType = 'seat'
                this.render()
                return
            }
            const pointRoad = this.roadList.find((road) => {
                return this.ctx.isPointInPath(road.path, e.offsetX, e.offsetY)
            })
            if (pointRoad) {
                this.pointRoad = pointRoad
                this.menuType = 'road'
                this.menuInfo.show = true
                this.menuInfo.x = e.offsetX
                this.menuInfo.y = e.offsetY
                this.menuX = e.offsetX + this.menuDistanceX
                this.menuY = e.offsetY + this.menuDistanceY
                pointRoad.selected = true
                this.selectedSeats = []
                this.resetSelect()
                return
            }

            const pointerOrder = this.orderList.find((order) => {
                return this.ctx.isPointInPath(order.path, e.offsetX, e.offsetY)
            })
            if (pointerOrder) {
                this.pointerOrder = pointerOrder
                this.menuType = 'order'
                this.menuInfo.show = true
                this.menuInfo.x = e.offsetX
                this.menuInfo.y = e.offsetY
                this.menuX = e.offsetX + this.menuDistanceX
                this.menuY = e.offsetY + this.menuDistanceY
                this.seatList.forEach((seat) => {
                    seat.selected = false
                })
                this.selectedSeats = this.seatList.filter((seat) => seat.rowIndex == pointerOrder.rowIndex)
                this.selectedSeats.forEach((seat) => {
                    seat.selected = true
                })
                this.render()
                return
            }
        },
        // 获取历史记录
        getHistory(step) {
            if (step === 1) {
                this.seatHistory.prev()
            } else {
                this.seatHistory.back()
            }
            const nowHistory = this.seatHistory.getHistory()
            if (nowHistory) {
                const { seatList, orderList, roadList } = nowHistory
                this.seatList = seatList
                this.orderList = orderList
                this.roadList = roadList
                this.getOldSettedArea()
                this.render()
                this.saveAll()
            }
        },
        // 向上添加过道
        addTopRoad() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            // 筛选出所有在当前座位排之后的序号（包含当前排），并向后移动一排
            const orders = this.orderList.filter((order) => order.y >= pointSeat.y)
            orders.forEach((order) => {
                order.y = order.y + 1
            })
            // 筛选出所有在当前座位排之后的过道，并向后移动一排
            const roads = this.roadList.filter((road) => road.y >= pointSeat.y)
            roads.forEach((road) => {
                road.y = road.y + 1
                road.rowIndex = road.rowIndex + 1
            })
            // 筛选出所有在当前座位排之后的座位（包含当前排），并向后移动一排
            const seats = this.seatList.filter((seat) => seat.y >= pointSeat.y)
            const max = this.seatList.map((seat) => seat.x).sort((a, b) => b - a)[0]
            seats.forEach((seat) => {
                seat.y = seat.y + 1
            })
            // 在过道列表中加入过道
            this.id++
            this.roadList.push({
                personId: '',
                enable: true,
                id: this.id,
                x: 1, // 过道从第几列开始
                y: pointSeat.y - 1, // 过道从第几行开始
                seatType: 3,
                colIndex: parseInt(max) + 1, // 过道至第几列
                rowIndex: pointSeat.y, // 过道至第几行
                areaId: 0,
                path: '',
                selected: false,
                name: '横向过道',
                number: '',
            })
            this.render()
            this.addHistory()
            this.saveAll()
            this.menuInfo.show = false
        },
        // 向下添加过道
        addBottomRoad() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            // 筛选出所有在当前座位排之后的座位（不包含当前排），并向后移动一排
            const orders = this.orderList.filter((order) => order.y > pointSeat.y)
            orders.forEach((order) => {
                order.y = order.y + 1
            })
            // 筛选出所有在当前座位排之后的过道，并向后移动一排
            const roads = this.roadList.filter((road) => road.y > pointSeat.y)
            roads.forEach((road) => {
                road.y = road.y + 1
                road.rowIndex = road.rowIndex + 1
            })
            // 筛选出所有在当前座位排之后的序号（不包含当前排），并向后移动一排
            const seats = this.seatList.filter((seat) => seat.y > pointSeat.y)
            const max = this.seatList.map((seat) => seat.x).sort((a, b) => b - a)[0]
            seats.forEach((seat) => {
                seat.y = seat.y + 1
            })
            // 在过道列表中加入一整排
            this.id++
            this.roadList.push({
                personId: 0,
                enable: true,
                id: this.id,
                x: 1, // 过道从第几列开始
                y: pointSeat.y + 1, // 过道从第几行开始
                seatType: 3,
                colIndex: parseInt(max) + 1, // 过道至第几列
                rowIndex: pointSeat.y + 2, // 过道至第几行
                areaId: 0,
                path: '',
                selected: false,
                name: '横向过道',
            })
            this.render()
            this.addHistory()
            this.saveAll()
            this.menuInfo.show = false
        },
        // 向左添加过道
        addLeftRoad() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return

            const errprSeat = this.seatList.find((seat) => seat.x == pointSeat.x - 0.5)
            if (errprSeat) {
                this.$message.warning('有座位重叠，无法添加过道')
                return
            }
            const roads = this.roadList.filter((road) => road.x >= pointSeat.x)
            roads.forEach((road) => {
                road.x = road.x + 1
                road.colIndex = road.colIndex + 1
            })
            const seats = this.seatList.filter((seat) => seat.x >= pointSeat.x)
            const max = this.seatList.map((seat) => seat.y).sort((a, b) => b - a)[0]
            seats.forEach((seat) => {
                seat.x = seat.x + 1
            })
            this.id++
            this.roadList.push({
                id: this.id,
                personId: '',
                enable: true,
                x: pointSeat.x - 1, // 过道从第几列开始
                y: 0, // 过道从第几行开始
                seatType: 3,
                areaId: 0,
                colIndex: pointSeat.x, // 过道至第几列
                rowIndex: max + 1, // 过道至第几行
                path: '',
                selected: false,
                name: '纵向过道',
                number: '',
            })
            this.render()
            this.addHistory()
            this.saveAll()
            this.menuInfo.show = false
        },
        // 向右添加过道
        addRightRoad() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            if (pointSeat.colIndex == this.column) {
                this.$message.warning('当前已是最后一列')
                this.menuInfo.show = false
                return
            }
            const errprSeat = this.seatList.find((seat) => seat.x == pointSeat.x + 0.5)
            if (errprSeat) {
                this.$message.warning('有座位重叠，无法添加过道')
                return
            }
            const roads = this.roadList.filter((road) => road.x > pointSeat.x)
            roads.forEach((road) => {
                road.x = road.x + 1
                road.colIndex = road.colIndex + 1
            })
            const seats = this.seatList.filter((seat) => seat.x > pointSeat.x)
            const max = this.seatList.map((seat) => seat.y).sort((a, b) => b - a)[0]
            seats.forEach((seat) => {
                seat.x = seat.x + 1
            })
            this.id++
            this.roadList.push({
                id: this.id,
                personId: '',
                enable: true,
                x: pointSeat.x + 1, // 过道从第几列开始
                y: 0, // 过道从第几行开始
                seatType: 3,
                colIndex: pointSeat.x + 2, // 过道至第几列
                rowIndex: max + 1, // 过道至第几行
                path: '',
                selected: false,
                name: '纵向过道',
                number: '',
            })
            this.render()
            this.addHistory()
            this.saveAll()
            this.menuInfo.show = false
        },
        // 删除过道
        deleteRoad() {
            if (this.isEditRoadName) {
                return
            }
            const deleteRoad = this.roadList.find((road) => road.selected)
            if (!deleteRoad) {
                return
            }
            // 删除选中的过道
            this.roadList = this.roadList.filter((road) => !road.selected)
            const errorColSeat = this.seatList.find((seat) => seat.y == deleteRoad.y)
            const errorColRoad = this.roadList.find((road) => road.y == deleteRoad.y)
            if (!errorColSeat && !errorColRoad) {
                this.seatList.forEach((seat) => {
                    if (seat.y > deleteRoad.y) {
                        seat.y = seat.y - 1
                    }
                })
                this.roadList.forEach((road) => {
                    if (road.y > deleteRoad.y) {
                        road.y = road.y - 1
                        road.rowIndex = road.rowIndex - 1
                    }
                })
                this.orderList.forEach((order) => {
                    if (order.y > deleteRoad.y) {
                        order.y = order.y - 1
                    }
                })
            }
            const errorRowSeat = this.seatList.find((seat) => seat.x == deleteRoad.x)
            const errorRowRoad = this.roadList.find((road) => road.x == deleteRoad.x)
            if (!errorRowSeat && !errorRowRoad) {
                this.seatList.forEach((seat) => {
                    if (seat.x > deleteRoad.x) {
                        seat.x = seat.x - 1
                    }
                })
                this.roadList.forEach((road) => {
                    if (road.x > deleteRoad.x) {
                        road.x = road.x - 1
                        road.colIndex = road.colIndex - 1
                    }
                })
            }
            this.$refs.roadSetRef.close()
            this.menuInfo.show = false

            this.render()
            this.saveAll()
            this.addHistory()
        },
        // 向左移动座位
        adjustSeatOfLeft() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return

            // 筛选出同一排的座位
            let sameRowSeats = this.seatList.filter((seat) => seat.y == pointSeat.y && seat.x <= pointSeat.x)
            // 从右到左排序
            sameRowSeats = sameRowSeats.sort((a, b) => b.x - a.x)
            let startMoveIndex = -1
            // 判断出最近一个可以移动的空位
            for (let i = 0; i < sameRowSeats.length - 1; i++) {
                if (sameRowSeats[i].x - sameRowSeats[i + 1].x > 1) {
                    startMoveIndex = i
                    break
                }
            }
            if (startMoveIndex == -1) {
                // startMoveIndex等于-1 说明座位中间没有空位
                const endSeat = sameRowSeats[sameRowSeats.length - 1]
                if (endSeat.x > 1) {
                    const seatWidth = this.seatWidthSize * this.singleCellSize
                    const seatHeight = this.seatHeightSize * this.singleCellSize
                    const errorRoad = this.roadList.find((road) => {
                        const ySize = road.rowIndex - road.y
                        const xSize = road.colIndex - road.x
                        const rect1 = {
                            x: road.x * seatWidth + 1,
                            y: road.y * seatHeight + 1,
                            width: seatWidth * xSize - 1,
                            height: seatHeight * ySize - 1,
                        }
                        const rect2 = {
                            x: (endSeat.x - 0.5) * seatWidth + 1,
                            y: endSeat.y * seatHeight + 1,
                            width: seatWidth - 1,
                            height: seatHeight - 1,
                        }
                        return this.rectCollide(rect1, rect2)
                    })
                    if (!errorRoad) {
                        sameRowSeats.forEach((seat) => {
                            seat.x = seat.x - 0.5
                        })
                    } else {
                        this.$message.warning('不可移动')
                        return
                    }
                } else {
                    this.$message.warning('不可移动')
                    return
                }
            } else {
                // 如果有空位，则将空位右侧的座位向左移动半格
                const endSeat = sameRowSeats[startMoveIndex]
                const seatWidth = this.seatWidthSize * this.singleCellSize
                const seatHeight = this.seatHeightSize * this.singleCellSize
                const errorRoad = this.roadList.find((road) => {
                    const ySize = road.rowIndex - road.y
                    const xSize = road.colIndex - road.x
                    const rect1 = {
                        x: road.x * seatWidth + 1,
                        y: road.y * seatHeight + 1,
                        width: seatWidth * xSize - 1,
                        height: seatHeight * ySize - 1,
                    }
                    const rect2 = {
                        x: (endSeat.x - 0.5) * seatWidth + 1,
                        y: endSeat.y * seatHeight + 1,
                        width: seatWidth - 1,
                        height: seatHeight - 1,
                    }
                    return this.rectCollide(rect1, rect2)
                })
                if (!errorRoad) {
                    sameRowSeats.forEach((item, index) => {
                        if (index <= startMoveIndex) {
                            item.x = item.x - 0.5
                        }
                    })
                } else {
                    this.$message.warning('不可移动')
                    return
                }
            }
            this.render()
            this.saveAll()
            this.addHistory()
        },
        // 向右移动座位
        adjustSeatOfRight() {
            const pointSeat = this.selectedSeats[0]
            if (!pointSeat) return
            // 筛选出同一排的座位
            let sameRowSeats = this.seatList.filter((seat) => seat.y == pointSeat.y && seat.x >= pointSeat.x)
            sameRowSeats = sameRowSeats.sort((a, b) => a.x - b.x)
            let startMoveIndex = -1
            // 判断出最近一个可以移动的空位
            for (let i = 0; i < sameRowSeats.length - 1; i++) {
                if (sameRowSeats[i + 1].x - sameRowSeats[i].x > 1) {
                    startMoveIndex = i
                    break
                }
            }
            if (startMoveIndex == -1) {
                // startMoveIndex等于-1 说明座位中间没有空位
                const endSeat = sameRowSeats[sameRowSeats.length - 1]
                const maxX = this.row < 25 ? 50 : this.row * 2
                if (endSeat.x < maxX) {
                    const seatWidth = this.seatWidthSize * this.singleCellSize
                    const seatHeight = this.seatHeightSize * this.singleCellSize
                    const errorRoad = this.roadList.find((road) => {
                        const ySize = road.rowIndex - road.y
                        const xSize = road.colIndex - road.x
                        const rect1 = {
                            x: road.x * seatWidth + 1,
                            y: road.y * seatHeight + 1,
                            width: seatWidth * xSize - 1,
                            height: seatHeight * ySize - 1,
                        }
                        const rect2 = {
                            x: (endSeat.x + 0.5) * seatWidth + 1,
                            y: endSeat.y * seatHeight + 1,
                            width: seatWidth - 1,
                            height: seatHeight - 1,
                        }
                        return this.rectCollide(rect1, rect2)
                    })
                    if (!errorRoad) {
                        sameRowSeats.forEach((seat) => {
                            seat.x = seat.x + 0.5
                        })
                    } else {
                        this.$message.warning('不可移动')
                        return
                    }
                } else {
                    this.$message.warning('不可移动')
                    return
                }
            } else {
                // 如果有空位，则将空位右侧的座位向左移动半格
                const endSeat = sameRowSeats[startMoveIndex]
                const seatWidth = this.seatWidthSize * this.singleCellSize
                const seatHeight = this.seatHeightSize * this.singleCellSize
                const errorRoad = this.roadList.find((road) => {
                    const ySize = road.rowIndex - road.y
                    const xSize = road.colIndex - road.x
                    const rect1 = {
                        x: road.x * seatWidth + 1,
                        y: road.y * seatHeight + 1,
                        width: seatWidth * xSize - 1,
                        height: seatHeight * ySize - 1,
                    }
                    const rect2 = {
                        x: (endSeat.x + 0.5) * seatWidth + 1,
                        y: endSeat.y * seatHeight + 1,
                        width: seatWidth - 1,
                        height: seatHeight - 1,
                    }
                    return this.rectCollide(rect1, rect2)
                })
                if (!errorRoad) {
                    sameRowSeats.forEach((item, index) => {
                        if (index <= startMoveIndex) {
                            item.x = item.x + 0.5
                        }
                    })
                } else {
                    this.$message.warning('不可移动')
                    return
                }
            }
            this.render()
            this.saveAll()
            this.addHistory()
        },
        // 删除座位
        deleteSeat() {
            if (this.selectedSeats.length == 0) return
            const personSeats = this.selectedSeats.filter((seat) => seat.personId && seat.areaId != 1000)
            if (personSeats.length > 0) {
                personSeats.forEach((seat) => {
                    seat.personId = ''
                    seat.name = ''
                })
            } else {
                const areaSeats = this.selectedSeats.filter((seat) => seat.areaId && seat.areaId != 1000)
                if (areaSeats.length > 0) {
                    areaSeats.forEach((seat) => {
                        seat.personId = ''
                        seat.name = ''
                        seat.areaId = ''
                    })
                } else {
                    const delIds = this.selectedSeats.filter((seat) => seat.areaId != 1000).map((seat) => seat.id)
                    this.seatList = this.seatList.filter((seat) => !delIds.includes(seat.id))
                    this.orderList.forEach((order) => {
                        let nowOrderSeats = this.seatList.filter((seat) => seat.y == order.y)
                        nowOrderSeats = nowOrderSeats.sort((a, b) => a.x - b.x)
                        nowOrderSeats.forEach((seat, index) => {
                            seat.colIndex = index + 1
                        })
                    })
                }
            }
            this.menuInfo.show = false
            this.resetSelect()
            this.saveAll()
            this.addHistory()
        },
        // 添加历史记录
        addHistory() {
            this.seatHistory.add({
                row: this.row,
                col: this.col,
                seatList: this.seatList,
                orderList: this.orderList,
                roadList: this.roadList,
            })
        },
        // 选中过道
        selectRoad(x, y) {
            // 如果是在设置区域那么直接返回
            if (this.activeArea) {
                return
            }
            const selectedRoad = this.roadList.find((road) => {
                return this.ctx.isPointInPath(road.path, x, y)
            })
            // 判断是否选中过道
            if (selectedRoad) {
                this.roadList.forEach((road) => (road.selected = false))
                selectedRoad.selected = true
                if (this.selectedSeats.length > 0) {
                    this.selectedSeats.forEach((seat) => {
                        seat.selected = false
                    })
                }
                this.selectedSeats = []
                this.$refs.roadSetRef.open(selectedRoad)
            }
        },
        // 设置固定座位
        setFixedSeat(person) {
            this.inputStatus = false
            let pointSeat = this.selectedSeats[0]
            if (!pointSeat) {
                return
            }
            pointSeat.areaId = 1000
            pointSeat.name = person.personName
            pointSeat.personId = person.personId
            pointSeat = null
            this.getOldSettedArea()
            this.resetSelect()
            this.addHistory()
            this.saveAll()
        },
        // 选中座位
        selectSeat(x, y) {
            // 判断是否选中座位
            const pointSeat = this.seatList.find((seat) => {
                return this.ctx.isPointInPath(seat.path, x, y)
            })

            if (pointSeat) {
                // 设置中心座
                if (this.setCenter) {
                    if (!this.activeArea) {
                        this.$message.warning('请先选择区域')
                        return
                    }
                    if (pointSeat.areaId !== this.activeArea) {
                        this.$message.warning('请在当前选中区域设置中心座')
                        return
                    }
                    if (pointSeat.seatType == 4) {
                        pointSeat.seatType = 1
                        return
                    }
                    const errorSeat = this.seatList.find(
                        (seat) => seat.seatType == 4 && seat.y == pointSeat.y && seat.areaId == pointSeat.areaId,
                    )
                    if (errorSeat) {
                        this.$message.warning('该排已存在中心位置')
                        return
                    }
                    pointSeat.seatType = 4
                    return
                }

                // 选择区域
                if (this.activeArea) {
                    if (pointSeat.areaId) {
                        if (pointSeat.areaId == 1000) {
                            return
                        }
                        // 相同颜色取消选择
                        if (pointSeat.areaId == this.activeArea) {
                            pointSeat.areaId = ''
                            pointSeat.personId = ''
                            pointSeat.name = ''
                            pointSeat.seatType = 1
                        } else {
                            // 不同颜色，如果勾选强制选取那就改为当前颜色
                            if (this.forceSelect) {
                                pointSeat.areaId = this.activeArea
                                pointSeat.personId = ''
                                pointSeat.name = ''
                            }
                        }
                    } else {
                        // 空区域直接改为当前颜色
                        pointSeat.areaId = this.activeArea
                        pointSeat.personId = ''
                        pointSeat.name = ''
                    }
                    return
                }
                // 是否按下ctrl
                if (!this.ctrlLock) {
                    // 将所有座位和过道取消选中
                    this.seatList.forEach((seat) => (seat.selected = false))
                    pointSeat.selected = true
                    this.selectedSeats = [pointSeat]
                } else {
                    pointSeat.selected = !pointSeat.selected
                    this.selectedSeats = this.seatList.filter((seat) => seat.selected)
                }
            }
        },
        // 选中一排
        selectOrder(x, y) {
            const pointOrder = this.orderList.find((order) => {
                return this.ctx.isPointInPath(order.path, x, y)
            })
            if (pointOrder) {
                this.seatList.forEach((seat) => {
                    if (seat.y == pointOrder.y) {
                        seat.selected = true
                    } else {
                        seat.selected = false
                    }
                })
                this.selectedSeats = this.seatList.filter((seat) => seat.selected)
            }
            return pointOrder
        },
        // 区域选取
        drawSelectArea(x, y) {
            const width = x - this.startMousePoint.x
            const height = y - this.startMousePoint.y
            this.selectedSeats = []
            const areaSeat = this.seatList.filter((seat) => {
                const seatObj = {
                    x: seat.x * this.seatWidthSize * this.singleCellSize,
                    y: seat.y * this.seatHeightSize * this.singleCellSize,
                    width: this.seatWidthSize * this.singleCellSize,
                    height: this.seatHeightSize * this.singleCellSize,
                }
                const areaObj = {
                    x: this.startMousePoint.x - this.paddingLeftSize * this.singleCellSize,
                    y: this.startMousePoint.y - this.paddingTopSize * this.singleCellSize,
                    width: width,
                    height: height,
                }
                return this.isCollision(seatObj, areaObj)
            })
            // 当前是否在设置区域
            if (this.activeArea) {
                this.seatList.forEach((seat) => {
                    if (this.oldSettedArea[seat.id]) {
                        seat.areaId = this.oldSettedArea[seat.id].areaId
                        seat.personId = this.oldSettedArea[seat.id].personId
                        seat.name = this.oldSettedArea[seat.id].name
                        seat.seatType = this.oldSettedArea[seat.id].seatType
                    }
                })

                areaSeat.forEach((seat) => {
                    if (this.selectStatus == 'reduce') {
                        if (seat.areaId && seat.areaId == this.activeArea) {
                            seat.areaId = ''
                            seat.personId = ''
                            seat.name = ''
                            seat.seatType = 1
                        }
                    } else {
                        if (seat.enable) {
                            if (seat.areaId) {
                                if (seat.areaId != this.activeArea && this.forceSelect && seat.areaId !== 1000) {
                                    seat.areaId = this.activeArea
                                    seat.name = ''
                                    seat.personId = ''
                                }
                            } else {
                                seat.areaId = this.activeArea
                                seat.name = ''
                                seat.personId = ''
                            }
                        }
                    }
                })
                this.render()
                this.drawAreaRect(areaSeat)
            } else {
                // 是否按住ctrl
                if (!this.ctrlLock) {
                    this.seatList.forEach((seat) => (seat.selected = false))
                    areaSeat.forEach((seat) => (seat.selected = true))
                } else {
                    const areaSeatIds = areaSeat.map((seat) => seat.id)
                    this.seatList.forEach((seat) => {
                        if (this.selectStatus == 'reduce') {
                            if (this.oldSelectIds.includes(seat.id) && !areaSeatIds.includes(seat.id)) {
                                seat.selected = true
                            } else {
                                seat.selected = false
                            }
                        } else {
                            if (this.oldSelectIds.includes(seat.id) || areaSeatIds.includes(seat.id)) {
                                seat.selected = true
                            } else {
                                seat.selected = false
                            }
                        }
                    })
                }
                this.selectedSeats = this.seatList.filter((seat) => seat.selected)
                this.render()
                this.drawAreaRect(areaSeat)
            }
        },
        // 画选区框
        drawAreaRect(areaSeat) {
            if (areaSeat.length > 0) {
                let minX = 100
                let minY = 100
                let maxX = 0
                let maxY = 0
                areaSeat.forEach((seat) => {
                    if (seat.x < minX) {
                        minX = seat.x
                    }
                    if (seat.y < minY) {
                        minY = seat.y
                    }
                    if (seat.x > maxX) {
                        maxX = seat.x
                    }
                    if (seat.y > maxY) {
                        maxY = seat.y
                    }
                })
                const selectPath = new Path2D()
                selectPath.rect(
                    minX * this.singleCellSize * this.seatWidthSize,
                    minY * this.singleCellSize * this.seatHeightSize,
                    (maxX - minX + 1) * this.singleCellSize * this.seatWidthSize,
                    (maxY - minY + 1) * this.singleCellSize * this.seatHeightSize,
                )
                this.ctx.lineWidth = 1
                this.ctx.strokeStyle = '#217346'
                this.ctx.stroke(selectPath)
            }
        },
        // 判断是否在选框中
        isCollision(seat, area) {
            const oldPointX = seat.x + seat.width / 2
            const oldPointY = seat.y + seat.height / 2
            const pointX =
                oldPointX * this.offsetInfo.scale + this.offsetInfo.x + this.offsetInfo.moveX * this.offsetInfo.scale
            const pointY =
                oldPointY * this.offsetInfo.scale + this.offsetInfo.y + this.offsetInfo.moveY * this.offsetInfo.scale
            const disX = Math.abs(pointX - (area.x + area.width / 2))
            const disY = Math.abs(pointY - (area.y + area.height / 2))
            const disWidth = (seat.width * this.offsetInfo.scale) / 2 + Math.abs(area.width) / 2
            const disHeight = (seat.height * this.offsetInfo.scale) / 2 + Math.abs(area.height) / 2
            return disX < disWidth && disY < disHeight
        },
        // 取消选中
        resetSelect() {
            this.inputStatus = false
            this.seatList.forEach((seat) => {
                seat.selected = false
            })
            this.selectedSeats = []
            this.render()
        },
        // 鼠标按下
        mousedown(e) {
            this.$refs.searchRef && this.$refs.searchRef.blur()
            if (e.button == 2) {
                return
            }
            e.preventDefault()
            if (e.button == 0) {
                this.menuInfo.show = false
            }
            const offsetX = e.offsetX
            const offsetY = e.offsetY
            this.startMousePoint.x = offsetX
            this.startMousePoint.y = offsetY
            // 如果是平移状态
            if (this.operateType == 'OFFSET') {
                this.candrag = true
                return
            }
            if (this.preview) {
                return
            }
            // 是否在设置区域
            if (this.activeArea) {
                if (this.setCenter) {
                    this.operateType = 'SELECT'
                    return
                }
                const pointSeat = this.seatList.find((seat) => {
                    return this.ctx.isPointInPath(seat.path, offsetX, offsetY)
                })
                if (pointSeat) {
                    this.pointerArea = 'SEAT'
                    this.operateType = 'SELECT'
                    if (pointSeat.areaId == this.activeArea) {
                        this.selectStatus = 'reduce'
                    }
                } else {
                    // 开始框选
                    this.pointerArea = 'BLANK'
                    this.operateType = 'SELECT'
                }
                return
            }

            this.roadList.forEach((road) => {
                road.selected = false
            })
            // 判断是否点在已选中的座位上
            const pointSeat = this.seatList.find((seat) => {
                return this.ctx.isPointInPath(seat.path, offsetX, offsetY)
            })
            const pointRoad = this.roadList.find((road) => {
                return this.ctx.isPointInPath(road.path, offsetX, offsetY)
            })
            if (!pointRoad) {
                this.$refs.roadSetRef.close()
            }
            if (pointSeat) {
                this.pointerArea = 'SEAT'
                this.pointSeat = pointSeat
                if (pointSeat.selected) {
                    if (this.ctrlLock) {
                        // 如果按下ctrl 说明还在选取
                        this.operateType = 'SELECT'
                        this.selectStatus = 'reduce'
                    } else {
                        if (pointSeat.areaId) {
                            this.selectedSeats.forEach((seat) => {
                                if (seat.id != pointSeat.id) {
                                    seat.selected = false
                                }
                            })
                            this.selectedSeats = [pointSeat]
                            this.operateType = 'DRAG'
                        } else {
                            this.operateType = 'SELECT'
                        }
                    }
                } else {
                    this.operateType = 'SELECT'
                }
                // 如果点在已选中的座位上，开始拖拽
            } else {
                // 开始框选
                this.operateType = 'SELECT'
                this.pointerArea = 'BLANK'
            }
        },
        // 鼠标移动
        mousemove(e) {
            // 改变鼠标样式
            if (this.operateType != 'OFFSET' && !this.preview) {
                this.changeCursorStyle(e.offsetX, e.offsetY)
            }
            const distance = this.getDistance(
                {
                    x: e.offsetX,
                    y: e.offsetY,
                },
                {
                    x: this.startMousePoint.x,
                    y: this.startMousePoint.y,
                },
            )
            // 偏移量小于5 视为误操作
            if (distance < 5) {
                return
            }
            // 平移
            if (this.candrag) {
                this.translation(e.offsetX, e.offsetY)
                return
            }
            // 如果是预览状态
            if (this.preview) {
                return
            }
            if (this.operateType == 'DRAG') {
                this.operateType = 'DRAG_SEAT'
                return
            }
            if (this.operateType == 'DRAG_SEAT') {
                const moveX = e.offsetX - this.startMousePoint.x
                const moveY = e.offsetY - this.startMousePoint.y
                this.render()
                this.drawDragSeat(moveX, moveY)
                return
            }
            // 如果是选取状态，那么拖动这变成画选区
            if (this.operateType == 'SELECT') {
                this.operateType = 'SELECT_AREA'
                return
            }
            // 画选区
            if (this.operateType == 'SELECT_AREA') {
                const boundaryX = this.$refs.seatWrapper.offsetWidth - 50
                const boundaryY = this.$refs.seatWrapper.offsetHeight - 50
                const distanceX = e.offsetX + this.menuDistanceX
                const distanceY = e.offsetY + this.menuDistanceY
                let leftStep = 0
                let topStep = 0
                if (distanceX < 50) {
                    leftStep = 4
                } else if (distanceX > boundaryX) {
                    leftStep = -4
                } else {
                    leftStep = 0
                }
                if (distanceY < 50) {
                    topStep = 4
                } else if (distanceY > boundaryY) {
                    topStep = -4
                } else {
                    topStep = 0
                }
                if (this.timer) {
                    clearInterval(this.timer)
                    this.timer = null
                }

                if (distanceX < 50 || distanceY < 50 || distanceY > boundaryY || distanceX > boundaryX) {
                    this.timer = setInterval(() => {
                        if (this.menuDistanceX + leftStep < 0) {
                            this.menuDistanceX += leftStep
                        } else {
                            this.menuDistanceX = 0
                        }
                        if (this.menuDistanceY + topStep < 0) {
                            this.menuDistanceY += topStep
                        } else {
                            this.menuDistanceY = 0
                        }
                        this.canvasDOM.style.left = this.menuDistanceX + 'px'
                        this.canvasDOM.style.top = this.menuDistanceY + 'px'
                    }, 60)
                } else {
                    clearInterval(this.timer)
                    this.timer = null
                }
                this.drawSelectArea(e.offsetX, e.offsetY)
                return
            }
        },
        // 鼠标抬起
        mouseup(e) {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer == null
            }
            // 平移状态
            if (this.operateType == 'OFFSET') {
                this.cancelDrag()
                return
            }
            // 预览状态
            if (this.preview) {
                return
            }
            if (this.operateType == 'DRAG') {
                this.operateType = ''
                this.seatList.forEach((seat) => (seat.selected = false))
                this.pointSeat.selected = true
                this.selectedSeats = [this.pointSeat]
                this.render()
                return
            }
            // 拖拽
            if (this.operateType == 'DRAG_SEAT') {
                this.hanldeDrag(e)
                return
            }
            // 点选
            if (this.operateType == 'SELECT') {
                // 点空白区域
                if (this.pointerArea == 'BLANK') {
                    if (this.activeArea) {
                        this.$refs.areaDrawer.close()
                    }
                    this.selectRoad(e.offsetX, e.offsetY)
                    const pointOrder = this.selectOrder(e.offsetX, e.offsetY)
                    this.operateType = ''
                    this.selectStatus = 'add'
                    this.pointerArea = ''
                    if (!pointOrder) {
                        this.resetSelect()
                    }
                    this.render()
                    return
                }
                this.selectSeat(e.offsetX, e.offsetY)
                // 记录老状态
                this.oldSelectIds = this.selectedSeats.map((seat) => seat.id)
                if (this.activeArea || this.seatStatus != '' || this.setCenter) {
                    const isChange = this.getOldSettedArea(true)
                    if (isChange) {
                        this.saveAll()
                        this.addHistory()
                    }
                }
                this.operateType = ''
                this.selectStatus = 'add'
                if (this.selectedSeats.length == 0) {
                    this.resetSelect()
                } else {
                    this.render()
                }
                return
            }
            // 画选区
            if (this.operateType == 'SELECT_AREA') {
                if (this.activeArea) {
                    const isChange = this.getOldSettedArea(true)
                    if (isChange) {
                        this.saveAll()
                        this.addHistory()
                    }
                }
                this.oldSelectIds = this.selectedSeats.map((seat) => seat.id)
                this.operateType = ''
                this.selectStatus = 'add'
                this.render()
                return
            }
        },
        mouseout() {
            this.candrag = false
            if (this.timer) {
                clearInterval(this.timer)
                this.timer == null
            }
        },
        mouseenter() {},
        // 拖拽
        hanldeDrag(e) {
            const targetSeat = this.seatList.find((seat) => {
                return this.ctx.isPointInPath(seat.path, e.offsetX, e.offsetY)
            })
            if (targetSeat) {
                const pointerSeat = this.selectedSeats[0]
                if (targetSeat.areaId != pointerSeat.areaId) {
                    this.$message.warning('请选择相同区域的座位')
                    this.render()
                } else {
                    if (targetSeat.personId) {
                        const activeArea = this.areaList.find((area) => area.seatAreaId == pointerSeat.areaId)
                        const areaPersonGroup = this.personList.find((group) => group.id == activeArea.personGroupId)
                        const personList = areaPersonGroup.personList
                        const pointerIndex = personList.findIndex((p) => p.personId == pointerSeat.personId)
                        const targetIndex = personList.findIndex((p) => p.personId == targetSeat.personId)
                        personList[pointerIndex] = targetSeat
                        personList[targetIndex] = pointerSeat

                        const details = personList.map((p, index) => ({
                            areaId: pointerSeat.areaId,
                            personId: p.personId,
                            sortIndex: index,
                            personName: p.personName,
                            disabled: p.disabled,
                        }))
                        seatAreaPersonSort({
                            seatlayoutId: this.seatlayoutId,
                            details,
                        }).then(() => {
                            this.getPersonList()
                        })
                    }

                    const targetPersonId = targetSeat.personId
                    const targetPersonName = targetSeat.name
                    targetSeat.personId = pointerSeat.personId
                    targetSeat.name = pointerSeat.name
                    targetSeat.selected = true
                    pointerSeat.personId = targetPersonId
                    pointerSeat.name = targetPersonName
                    pointerSeat.selected = false
                    this.selectedSeats = [targetSeat]
                    this.oldSettedArea[targetSeat.id].personId = pointerSeat.personId
                    this.oldSettedArea[targetSeat.id].name = pointerSeat.name
                    this.oldSettedArea[pointerSeat.id].personId = targetPersonId
                    this.oldSettedArea[pointerSeat.id].name = targetPersonName
                    this.addHistory()
                    this.saveAll()
                    this.resetSelect()
                }
            }
            this.operateType = ''
        },
        // 绘制拖拽位置
        drawDragSeat(moveX, moveY) {
            const seat = this.selectedSeats[0]
            const newSeatPath = new Path2D()
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            const x = seat.x * seatWidth + moveX / this.offsetInfo.scale + this.offsetInfo.moveX
            const y = seat.y * seatHeight + moveY / this.offsetInfo.scale + this.offsetInfo.moveY

            newSeatPath.rect(x, y, this.seatWidthSize * this.singleCellSize, this.seatHeightSize * this.singleCellSize)
            this.ctx.stroke(newSeatPath)
            if (seat.areaId == 1000) {
                this.ctx.fillStyle = '#8540cf'
            } else {
                const area = this.areaList.find((area) => area.seatAreaId == seat.areaId)
                this.ctx.fillStyle = area.color
            }
            this.ctx.fill(newSeatPath)
            this.drawMessage(x + seatWidth / 2, y + seatHeight / 2, seat.name, this.isDirection)
            this.canvasDOM.style.cursor = 'move'
        },
        // 改变鼠标样式
        changeCursorStyle(x, y) {
            if (!this.canvasDOM) {
                return
            }
            const hoverSeat = this.seatList.find((seat) => {
                return this.ctx.isPointInPath(seat.path, x, y)
            })
            let hoverRoad = null
            if (this.roadList.length > 0) {
                hoverRoad = this.roadList.find((road) => {
                    return this.ctx.isPointInPath(road.path, x, y)
                })
            }
            if (hoverSeat || hoverRoad) {
                this.canvasDOM.style.cursor = 'cell'
            } else {
                const hoverOrder = this.orderList.find((order) => {
                    return this.ctx.isPointInPath(order.path, x, y)
                })
                if (hoverOrder) {
                    this.canvasDOM.style.cursor = 'e-resize'
                } else {
                    this.canvasDOM.style.cursor = ''
                }
            }
        },
        // 计算两点距离（偏移量）
        getDistance(p1, p2) {
            return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
        },
        // 平移
        translation(x, y) {
            const domLeft = this.canvasDOM.offsetLeft
            const domTop = this.canvasDOM.offsetTop

            let left = domLeft + x - this.startMousePoint.x
            let top = domTop + y - this.startMousePoint.y

            left = left > 0 ? 0 : left
            top = top > 0 ? 0 : top
            left = left > 0 ? 0 : left
            const minLeft = this.$refs.seatWrapper.offsetWidth - this.ctxWidth
            const minTop = this.$refs.seatWrapper.offsetHeight - this.ctxHeight
            left = left < minLeft ? minLeft : left
            top = top < minTop ? minTop : top

            this.menuDistanceX = left
            this.menuDistanceY = top

            this.canvasDOM.style.left = left + 'px'
            this.canvasDOM.style.top = top + 'px'
            // this.render();
        },
        // 取消平移
        cancelDrag() {
            if (this.candrag) {
                this.candrag = false
            }
        },
        // 绘制
        render() {
            // 重置尺寸清空画布
            if (!this.ctx) {
                return
            }
            this.ctx.setTransform(1, 0, 0, 1, 0, 0)
            this.ctx.clearRect(0, 0, this.canvasDOM.width, this.canvasDOM.height)
            // 设置为原尺寸
            this.ctx.setTransform(
                this.offsetInfo.scale,
                0,
                0,
                this.offsetInfo.scale,
                this.offsetInfo.x + this.offsetInfo.moveX + this.paddingLeftSize * this.singleCellSize,
                this.offsetInfo.y + this.offsetInfo.moveY + this.paddingTopSize * this.singleCellSize,
            )
            // 绘制序号
            this.orderList.forEach((order) => {
                this.drawOrder(order)
            })
            // 绘制座位
            this.seatList.forEach((seat) => {
                this.drawSeat(seat)
            })
            // 绘制过道
            this.roadList.forEach((road) => {
                this.drawRoad(road)
            })
            const fixedSeats = this.seatList.filter((seat) => seat.areaId == '1000')
            if (fixedSeats.length > 0) {
                fixedSeats.forEach((seat) => {
                    this.drawFixed(seat)
                })
            }
        },
        drawFixed(seat) {
            const { x, y } = seat
            this.ctx.save()
            const seatPath = new Path2D()
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            seatPath.rect(x * seatWidth + 1, y * seatHeight + 1, seatWidth - 1, seatHeight - 1)
            this.ctx.setLineDash([5, 5])
            this.ctx.strokeStyle = '#ffffff'
            this.ctx.lineWidth = 2

            this.ctx.stroke(seatPath)
            this.ctx.restore()
        },
        // 初始化空座位
        initSeat() {
            for (let rowIndex = 0; rowIndex < this.row; rowIndex++) {
                for (let colIndex = 0; colIndex < this.col; colIndex++) {
                    this.id++
                    this.seatList.push({
                        id: this.id,
                        x: colIndex + 1, // Y 轴位置  相对于单元格
                        y: rowIndex, // X 轴位置  相对于单元格
                        path: null, // 座位的路径
                        name: '', // 座位的信息
                        colIndex: colIndex + 1, // 座位的列序号
                        rowIndex: rowIndex + 1, // 座位的行序号
                        areaId: '', // 改座位属于哪个区域
                        selected: false, // 是否选中
                        number: 0, // 座位号
                        enable: true,
                        seatType: 1,
                        personId: '',
                    })
                }
            }
        },
        // 绘制单个座位
        drawSeat(seat) {
            const { x, y, selected, name, number, enable, areaId, seatType } = seat
            const seatPath = new Path2D()
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            seatPath.rect(x * seatWidth + 1, y * seatHeight + 1, seatWidth - 1, seatHeight - 1)
            this.ctx.strokeStyle = this.defaultSeatBorderColor
            this.ctx.lineWidth = 1

            this.ctx.stroke(seatPath)

            if (!enable) {
                this.ctx.fillStyle = '#999999'
            } else {
                if (areaId) {
                    if (areaId == 1000) {
                        this.ctx.fillStyle = '#8540cf'
                    } else {
                        const area = this.areaList.find((area) => area.seatAreaId == areaId)
                        if (area) {
                            this.ctx.fillStyle = area.color
                        } else {
                            this.ctx.fillStyle = this.defaultSeatColor
                        }
                    }
                } else {
                    this.ctx.fillStyle = this.defaultSeatColor
                }
            }

            this.ctx.fill(seatPath)
            seat.path = seatPath

            if (seatType == 4) {
                const centerPath = new Path2D()
                centerPath.rect(x * seatWidth + 1, y * seatHeight + 1, seatWidth - 2, seatHeight - 2)
                this.ctx.strokeStyle = '#aa381e'
                this.ctx.lineWidth = 2
                this.ctx.stroke(centerPath)
            }
            const centerX = x * seatWidth + seatWidth / 2
            const centerY = y * seatHeight + seatHeight / 2
            if (name) {
                // const nameStr = name.length > 5 ? name.slice(0, 5) : name
                const color = areaId == 1000 ? '#fff' : '#303133'
                this.drawMessage(centerX, centerY, name, this.isDirection, color)
                this.drawNumber(x, y, number)
            } else {
                this.drawMessage(centerX, centerY, number, this.isDirection)
            }
            if (selected) {
                this.drawSelected(seat)
            }
        },
        // 绘制选中区域
        drawSelected(seat) {
            const { x, y } = seat
            const selectedPath = new Path2D()
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            selectedPath.rect(x * seatWidth, y * seatHeight, seatWidth, seatHeight)
            this.ctx.fillStyle = this.selectedSeatColor
            this.ctx.globalAlpha = 0.4
            this.ctx.fill(selectedPath)
            this.ctx.globalAlpha = 1
        },
        // 绘制过道
        drawRoad(road) {
            const { x, y, selected, name, colIndex, rowIndex } = road
            const roadPath = new Path2D()
            const vertical = this.isDirection
            // if (name == '纵向过道') {
            //   vertical = true
            // }
            const ySize = rowIndex - y
            const xSize = colIndex - x
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            this.ctx.save()
            roadPath.rect(x * seatWidth + 1, y * seatHeight + 1, seatWidth * xSize - 1, seatHeight * ySize - 1)
            this.ctx.strokeStyle = this.defaultSeatBorderColor
            this.ctx.lineWidth = 1
            this.ctx.stroke(roadPath)
            if (selected) {
                this.ctx.globalAlpha = 0.4
                this.ctx.fillStyle = this.selectedSeatColor
            } else {
                this.ctx.globalAlpha = 0.5
                this.ctx.fillStyle = this.defaultRoadColor
            }
            this.ctx.fill(roadPath)
            this.ctx.save()
            const centerX = x * seatWidth + (seatWidth * xSize) / 2
            const centerY = y * seatHeight + (seatHeight * ySize) / 2
            this.drawMessage(centerX, centerY, name, vertical)
            road.path = roadPath
            this.ctx.globalAlpha = 1
            // 绘制虚框
            this.ctx.restore()
            const roadPathDotted = new Path2D()
            roadPathDotted.rect(x * seatWidth + 5, y * seatHeight + 5, seatWidth * xSize - 10, seatHeight * ySize - 10)
            this.ctx.strokeStyle = '#ffffff'
            this.ctx.lineWidth = 1
            this.ctx.setLineDash([5, 5])
            this.ctx.stroke(roadPathDotted)
            this.ctx.restore()
        },
        // 初始化序列
        initOrder() {
            for (let rowIndex = 0; rowIndex < this.row; rowIndex++) {
                this.id++
                this.orderList.push({
                    id: this.id,
                    personId: '',
                    enable: true,
                    x: 0, // X 轴位置, 1 代表一个座位宽度一半
                    y: rowIndex, // Y 轴位置，1 代表一个座位高度
                    path: null, // 座位的路径
                    name: '', // 座位的信息
                    colIndex: 0, // 座位的列序号
                    rowIndex: rowIndex + 1, // 座位的行序号
                    areaId: '',
                    selected: false,
                    seatType: 2,
                    number: '',
                })
            }
        },
        // 绘制单个序列
        drawOrder(order) {
            const { x, y, name, selected, rowIndex } = order
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            const orderPath = new Path2D()
            orderPath.rect(x * seatWidth + 1, y * seatHeight + 1, seatWidth - 1, seatHeight - 1)
            this.ctx.strokeStyle = this.defaultSeatBorderColor
            this.ctx.lineWidth = 1
            this.ctx.stroke(orderPath)
            this.ctx.fillStyle = '#fff9e6'
            this.ctx.fill(orderPath)
            const centerX = x * seatWidth + seatWidth / 2
            const centerY = y * seatHeight + seatHeight / 2
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillStyle = selected ? '#ffffff' : '#303133'
            this.ctx.font = '14px Verdana'
            const str = name || rowIndex + '排'
            this.ctx.fillText(str, centerX, centerY)
            order.path = orderPath
        },
        // 绘制文字信息
        drawMessage(x, y, name, vertical = false, color = '#303133') {
            if (name == 0) {
                return
            }
            if (vertical && name.length > 0) {
                if (name.length > 5) {
                    const leftName = name.slice(0, 5)
                    for (let i = 0; i < leftName.length; i++) {
                        const str = leftName.slice(i, i + 1)
                        this.ctx.textAlign = 'center'
                        this.ctx.textBaseline = 'middle'
                        this.ctx.fillStyle = color
                        this.ctx.font = '12px Verdana'
                        const newY = y + 13 + i * 13 - leftName.length * 7
                        this.ctx.fillText(str, x - 7, newY)
                    }
                    const rightName = name.slice(5)
                    for (let i = 0; i < rightName.length; i++) {
                        const str = rightName.slice(i, i + 1)
                        this.ctx.textAlign = 'center'
                        this.ctx.textBaseline = 'middle'
                        this.ctx.fillStyle = color
                        this.ctx.font = '12px Verdana'
                        const newY = y + 13 + i * 13 - rightName.length * 7
                        this.ctx.fillText(str, x + 7, newY)
                    }
                } else {
                    for (let i = 0; i < name.length; i++) {
                        const str = name.slice(i, i + 1)
                        this.ctx.textAlign = 'center'
                        this.ctx.textBaseline = 'middle'
                        this.ctx.fillStyle = color
                        this.ctx.font = '12px Verdana'
                        const newY = y + 13 + i * 13 - name.length * 7
                        this.ctx.fillText(str, x, newY)
                    }
                }
            } else {
                this.ctx.textAlign = 'center'
                this.ctx.textBaseline = 'middle'
                this.ctx.fillStyle = color
                this.ctx.font = '12px Verdana'
                if (name.length > 5) {
                    this.ctx.fillText(name.slice(5), x, y + 9)
                    this.ctx.fillText(name.slice(0, 5), x, y - 5)
                } else {
                    this.ctx.fillText(name, x, y)
                }
            }
        },
        // 绘制座位号
        drawNumber(x, y, number, selected) {
            if (number == 0) {
                return
            }
            const numberPath = new Path2D()
            const seatWidth = this.seatWidthSize * this.singleCellSize
            const seatHeight = this.seatHeightSize * this.singleCellSize
            numberPath.rect(
                (x + 1) * seatWidth - this.singleCellSize,
                y * seatHeight,
                this.singleCellSize,
                this.singleCellSize,
            )
            this.ctx.globalAlpha = 0.4
            this.ctx.fillStyle = '#333'
            this.ctx.fill(numberPath)
            this.ctx.globalAlpha = 1
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'

            this.ctx.fillStyle = '#ffffff'
            this.ctx.font = '12px Verdana'
            this.ctx.fillText(
                number,
                (x + 1) * seatWidth - this.singleCellSize / 2,
                y * seatHeight + this.singleCellSize / 2,
            )
        },
        // 缩放
        setTransform(status) {
            if (status == 'add') {
                if (this.offsetInfo.scale < 1.5) {
                    this.offsetInfo.scale += this.offsetInfo.scaleStep
                }
            } else {
                if (this.offsetInfo.scale > 0.5) {
                    this.offsetInfo.scale -= this.offsetInfo.scaleStep
                }
            }
            this.render()
        },
        // 开启平移
        openDrag() {
            this.operateType = this.operateType == 'OFFSET' ? '' : 'OFFSET'
            if (this.operateType == 'OFFSET') {
                this.canvasDOM.style.cursor = 'grab'
                this.resetSelect()
            } else {
                this.canvasDOM.style.cursor = ''
            }
        },
        // 渲染区域列表
        renderAreaList() {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0)
            const areaPath = new Path2D()
            const legendList = [
                {
                    color: '#8540cf',
                    name: '固定人员',
                },
                {
                    color: '#999999',
                    name: '禁用座位',
                },
            ]
            const allLegend = this.areaList.concat(legendList)
            const areaWidth = allLegend.length * 115 + 30

            const top = this.ctxHeight - this.paddingTopSize * this.singleCellSize
            areaPath.rect(20, top, areaWidth, 48)
            this.ctx.stroke(areaPath)
            this.ctx.fillStyle = '#fff'
            this.ctx.fill(areaPath)
            allLegend.forEach((area, index) => {
                this.ctx.save()
                const itemPath = new Path2D()
                const left = 40 + index * 115
                itemPath.rect(left, top + 19, 20, 10)
                this.ctx.stroke(itemPath)
                this.ctx.fillStyle = area.color
                this.ctx.fill(itemPath)
                this.ctx.textAlign = 'left'
                this.ctx.textBaseline = 'middle'
                if (area.name == '固定人员') {
                    this.ctx.setLineDash([3, 3])
                    this.ctx.strokeStyle = '#ffffff'
                    this.ctx.lineWidth = 2
                    this.ctx.stroke(itemPath)
                }
                this.ctx.fillStyle = '#303133'
                this.ctx.font = '12px Verdana'
                this.ctx.fillText(area.name, left + 30, top + 25)
                this.ctx.restore()
            })
        },
        renderLegend() {
            const areaWidth = this.areaList.length * 115 + 30 + this.paddingLeftSize * 2 * this.singleCellSize
            const top = this.ctxHeight - this.paddingTopSize * this.singleCellSize
            this.ctx.save()
            const fixedPath = new Path2D()
            fixedPath.rect(areaWidth + 10, top + 19, 20, 10)
            this.ctx.stroke(fixedPath)
            this.ctx.fillStyle = '#8540cf'
            this.ctx.fill(fixedPath)
            this.ctx.textAlign = 'left'
            this.ctx.textBaseline = 'middle'
            this.ctx.setLineDash([3, 3])
            this.ctx.strokeStyle = '#ffffff'
            this.ctx.lineWidth = 2
            this.ctx.stroke(fixedPath)
            this.ctx.fillStyle = '#303133'
            this.ctx.font = '12px Verdana'
            this.ctx.fillText('固定人员', areaWidth + 40, top + 25)
            this.ctx.restore()

            const disablePath = new Path2D()
            disablePath.rect(areaWidth + 110, top + 19, 20, 10)
            this.ctx.stroke(disablePath)
            this.ctx.fillStyle = '#999999'
            this.ctx.fill(disablePath)
            this.ctx.textAlign = 'left'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillStyle = '#303133'
            this.ctx.font = '12px Verdana'
            this.ctx.fillText('禁用座位', areaWidth + 140, top + 25)
        },
        renderTitle() {
            this.ctx.textAlign = 'center'
            this.ctx.textBaseline = 'middle'
            this.ctx.fillStyle = '#2a4969'
            this.ctx.font = '20px Verdana'
            this.ctx.fillText(this.layoutName, this.ctxWidth / 2, 30)
        },
        // 导出座位表
        exportSeat() {
            this.canvasToDataUrl().then((dataURL) => {
                var link = document.createElement('a')
                link.href = dataURL
                link.download = this.layoutName + '.png' // 设置导出的图片文件名
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
        },
        generatePreview() {
            this.canvasToDataUrl().then((dataURL) => {
                debugger
                const filename = this.layoutName + '.png'
                // 将base64的数据部分提取出来
                const binary = atob(dataURL.split(',')[1])
                // 创建一个Uint8Array来存储二进制数据
                const array = []
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i))
                }
                // 创建Blob对象
                const mimeString = dataURL.split(',')[0].match(/:(.*?);/)[1]
                const blob = new Blob([new Uint8Array(array)], { type: mimeString })
                // 创建File对象
                var file = new File([blob], filename, { type: mimeString })

                savePreview(this.seatlayoutId, file).then(()=>{
                    this.$message.success('生成成功')
                })
            })
        },
        canvasToDataUrl() {
            return new Promise((resolve) => {
                this.paddingTopSize = 3
                seatLayoutInfo({ id: this.seatlayoutId }).then((res) => {
                    const cellList = res.data.seatList
                    let maxX = 0
                    let maxY = 0
                    cellList.forEach((cell) => {
                        if (cell.x > maxX) {
                            maxX = cell.x
                        }
                        if (cell.y > maxY) {
                            maxY = cell.y
                        }
                    })
                    const areaWidth =
                        (this.areaList.length + 2) * 115 + 30 + this.paddingLeftSize * 2 * this.singleCellSize
                    this.ctxWidth =
                        (maxX + 1) * this.seatWidthSize * this.singleCellSize +
                        this.paddingLeftSize * 2 * this.singleCellSize

                    this.ctxWidth = this.ctxWidth > areaWidth ? this.ctxWidth : areaWidth
                    this.ctxHeight =
                        (maxY + 1) * this.seatHeightSize * this.singleCellSize +
                        this.paddingTopSize * this.singleCellSize * 2 +
                        20

                    this.$nextTick(() => {
                        this.resetPosition()
                        this.renderAreaList()
                        this.renderTitle()
                        // this.renderLegend()
                        var dataURL = this.canvasDOM.toDataURL('image/png') // 将canvas转换为data URL
                        resolve(dataURL)
                        this.ctxWidth = this.$refs.seatWrapper.offsetWidth
                        this.ctxHeight = this.$refs.seatWrapper.offsetHeight
                        this.$nextTick(() => {
                            this.paddingTopSize = 1
                            this.resetPosition()
                        })
                    })
                })
            })
        },
        // 矩形碰撞检测
        rectCollide(rect1, rect2) {
            // 如果矩形1的右边界大于等于矩形2的左边界，且矩形1的左边界小于等于矩形2的右边界，且矩形1的下边界大于等于矩形2的上边界，且矩形1的上边界小于等于矩形2的下边界，说明两个矩形有重叠部分，发生了碰撞
            if (
                rect1.x + rect1.width > rect2.x &&
                rect1.x < rect2.x + rect2.width &&
                rect1.y + rect1.height > rect2.y &&
                rect1.y < rect2.y + rect2.height
            ) {
                return true
            }
            // 否则，说明两个矩形没有重叠部分，没有发生碰撞
            return false
        },
    },
}
</script>

<style lang="scss" scoped>
.layout-container {
    width: 100%;
    height: 100%;
}
.layout-container-operate {
    display: flex;
    padding: 5px 0;
    background-color: #fff;
    justify-content: space-between;
    position: relative;
    align-items: center;
}
.operate-left {
    align-items: center;
    display: flex;
    .el-button {
        padding: 0;
    }
}
.history-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #606266;
}
.disabled {
    opacity: 0.5;
}

.layout-main {
    width: 100%;
    border-radius: 5px;
    background-color: #f8f8f8;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    display: flex;
    flex-direction: column;
    .ctx-main {
        flex: 1;
        position: relative;
    }
    .tools {
        position: absolute;
        background: #fff;
        padding: 5px 0;
        border-radius: 4px;
        user-select: none;
        box-shadow:
            -2px 2px 5px rgba(0, 0, 0, 0.08),
            2px 2px 5px rgba(0, 0, 0, 0.08);
    }
    .stage-tools {
        width: 40px;
        left: 10px;
        bottom: 10px;
        display: flex;
        opacity: 0.7;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .stage-tools-item {
        margin: 5px 0;
        width: 24px;
        height: 24px;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        line-height: 24px;
        float: left;
    }
    .tool-underline {
        height: 0;
        border-bottom: 1px solid #ccc;
        margin: 5px 12px;
    }
    .active {
        // background-color: #409eff;
        color: #4464e3;
    }
    .operate-tools {
        width: 78px;
        padding: 0 5px;
        right: 20px;
        top: 20px;
    }
    .operate-tools-item {
        width: 24px;
        height: 24px;
        margin: 10px 5px;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        line-height: 24px;
        float: left;
    }
    .contextmenu {
        width: 140px;
        height: auto;
        position: absolute;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        background-color: #fff;
        z-index: 999;
        left: 0;
        top: 0;
        padding: 3px 0;
        box-sizing: border-box;
        box-shadow: 3px 3px 2px 0 rgba(0, 0, 0, 0.3);
    }
    .menu-item {
        height: 30px;
        display: flex;
        width: 100%;
        border-radius: 0;
        color: #606266;
        align-items: center;
        cursor: pointer;
        padding-left: 25px;
        font-size: 12px;
        margin-left: 0;
        border: 0 none;
        &:hover {
            background: #eeeeee;
        }
        &:disabled {
            background-color: #fff;
            color: #c0c4cc;
        }
    }
    .menu-underline {
        border-bottom: 1px solid #dcdfe6;
    }
    .submenu {
        position: relative;
        &:hover {
            .child-contextmenu {
                display: block;
            }
        }
    }
    .child-contextmenu {
        display: none;
        width: 140px;
        height: auto;
        position: absolute;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        background-color: #fff;
        z-index: 999;
        left: 135px;
        top: 0;
        padding: 3px 0;
        box-sizing: border-box;
        box-shadow: 3px 3px 2px 0 rgba(0, 0, 0, 0.3);
        &:hover {
            display: block;
        }
    }
}
.full-screen {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    padding: 10px 10px 0;
    background-color: #fff;
}

.top-tool {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    color: #606266;
    // cursor: pointer;
    span {
        padding-top: 5px;
    }
    &.active {
        color: #4464e3;
    }
    &.disable {
        opacity: 0.5;
    }
}
.ctx-dom {
    position: absolute;
    left: 0;
    top: 0;
}
.seat-message {
    position: absolute;
    right: 10px;
    bottom: 10px;
    span {
        padding-right: 15px;
        font-size: 12px;
        color: #606266;
    }
}
</style>
