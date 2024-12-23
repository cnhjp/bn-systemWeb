<template>
    <div v-show="dialogVisible" class="road-set">
        <div class="road-set-top">过道设置</div>
        <el-form class="road-form" label-width="80px">
            <el-form-item label="名称: ">
                <el-input
                    v-model="roadFrom.name"
                    placeholder="请输入名称"
                    maxlength="10"
                    @change="handleChange"
                    @focus="$emit('editRoadName', true)"
                    @blur="$emit('editRoadName', false)"
                />
            </el-form-item>
            <el-form-item label="过道跨列:">
                <div class="road-ipt-wrap">
                    <div>
                        第
                        <el-input-number
                            v-model="roadFrom.startCol"
                            size="small"
                            :min="minCol"
                            :max="roadFrom.endCol > minCol ? roadFrom.endCol : maxCol"
                            @change="handleChange"
                        />
                        列
                    </div>
                    <span>至</span>
                    <div>
                        第
                        <el-input-number
                            v-model="roadFrom.endCol"
                            size="small"
                            :min="roadFrom.startCol > maxCol ? minCol : roadFrom.startCol"
                            :max="maxCol"
                            @change="handleChange"
                        />
                        列
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="过道跨行:">
                <div class="road-ipt-wrap">
                    <div>
                        第
                        <el-input-number
                            v-model="roadFrom.startRow"
                            size="small"
                            :min="minRow"
                            :max="roadFrom.endCol > minCol ? roadFrom.endCol : maxCol"
                            @change="handleChange"
                        />
                        行
                    </div>
                    <span>至</span>
                    <div>
                        第
                        <el-input-number
                            v-model="roadFrom.endRow"
                            size="small"
                            :min="roadFrom.startCol > maxCol ? minCol : roadFrom.startCol"
                            :max="maxRow"
                            @change="handleChange"
                        />
                        行
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        seatList: {
            type: Array,
            default() {
                return []
            },
        },
    },
    data() {
        return {
            dialogVisible: false,
            roadFrom: {
                id: '',
                name: '',
                startCol: 0,
                endCol: 0,
                startRow: 0,
                endRow: 0,
            },
            minRow: 1,
            maxRow: 80,
            minCol: 2,
            maxCol: 80,
        }
    },
    methods: {
        open(road) {
            this.roadFrom.name = road.name
            this.roadFrom.id = road.id
            // if (road.name == '横向过道') {
            //   this.roadFrom.startRow = road.y + 1
            //   this.roadFrom.endRow = road.rowIndex + 1
            //   this.roadFrom.startCol = road.x
            //   this.roadFrom.endCol = road.colIndex - 1
            // } else {
            //   this.roadFrom.startRow = road.y + 1
            //   this.roadFrom.endRow = road.rowIndex
            //   this.roadFrom.startCol = road.x
            //   this.roadFrom.endCol = road.colIndex
            // }
            this.roadFrom.startRow = road.y + 1
            this.roadFrom.endRow = road.rowIndex
            this.roadFrom.startCol = road.x + 1
            this.roadFrom.endCol = road.colIndex
            this.getBoundary(road)
            this.dialogVisible = true
        },
        getBoundary(road) {
            this.minRow = 1
            this.maxRow = 80
            this.minCol = 2
            this.maxCol = 80
            const topSeats = this.seatList.filter(
                (seat) => seat.y < road.y && seat.x >= road.x && seat.x < road.colIndex,
            )
            if (topSeats.length > 0) {
                this.minRow = Math.max(...topSeats.map((seat) => seat.y)) + 2
            }
            const bottomSeats = this.seatList.filter(
                (seat) => seat.y >= road.rowIndex && seat.x >= road.x && seat.x < road.colIndex,
            )
            if (bottomSeats.length > 0) {
                this.maxRow = Math.min(...bottomSeats.map((seat) => seat.y))
            }

            const leftSeats = this.seatList.filter(
                (seat) => seat.x < road.x && seat.y >= road.y && seat.y < road.rowIndex,
            )
            if (leftSeats.length > 0) {
                this.minCol = Math.max(...leftSeats.map((seat) => seat.x)) + 2
            }

            const rightSeats = this.seatList.filter(
                (seat) => seat.x >= road.colIndex && seat.y >= road.y && seat.y < road.rowIndex,
            )
            if (rightSeats.length > 0) {
                this.maxCol = Math.min(...rightSeats.map((seat) => seat.x))
            }
        },
        close() {
            this.dialogVisible = false
        },
        handleChange() {
            this.$emit('setRoad', this.roadFrom)
        },
    },
}
</script>

<style lang="scss" scoped>
.road-set {
    width: 310px;
    border-radius: 10px;
    background-color: #fff;
    border-radius: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
}
.road-form {
    padding: 30px 30px 0 20px;
    .el-input-number {
        width: 130px;
    }
}
.road-set-top {
    height: 50px;
    border-bottom: 1px solid #dcdfe6;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
}
.road-ipt-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
