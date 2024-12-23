<template>
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
</template>

<script lang="ts" setup>
const seatFormDialogStatus = ref('ADD')
/** 座位表编辑弹窗 */
const dialogSeatFormVisible = ref(false)

// 座席图列表
seatTableData: [],

/** 新增座位表 */
const hanldeAddSeat = () => {
    seatFormDialogStatus.value = 'ADD'
    dialogSeatFormVisible.value = true
}
</script>

<style lang="scss" scoped></style>
