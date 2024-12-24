<template>
    <div class="p-20px">
        <el-form :model="formModel" label-width="100px">
            <el-form-item label="酒店">
                <el-select v-model="formModel.hotelId" placeholder="会议角色" @change="onRefresh" @clear="onRefresh">
                    <el-option
                        v-for="item in hotelDropList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="所需安排人员">
                <el-radio-group v-model="formModel.arrangeType">
                    <el-radio :value="1" size="large">未安排房间人员</el-radio>
                    <el-radio :value="2" size="large">所有人员</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="el-flex is-center mt-20px">
            <el-button @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { setArrange, dropDownHotelType } from '@/api/accommodation-manage'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'refresh'])

const props = defineProps(['conventionId'])
const formModel = ref<any>({
    arrangeType: 1,
    hotelId: 0,
})
function onClose() {
    emits('close')
}

function onConfirm() {
    const data = {
        ...formModel.value,
        conventionId: props.conventionId,
    }
    setArrange(data).then(() => {
        ElMessage.success('操作成功')
        emits('refresh')
        emits('close')
    })
}
// 酒店下拉
const hotelDropList = ref<any>([])
async function dropDownHotel() {
    dropDownHotelType().then((res) => {
        const { data } = res
        hotelDropList.value = data.map((it: any) => {
            return {
                label: it.hotelName,
                value: it.id,
            }
        })
        formModel.value.hotelId = hotelDropList.value[0].value
    })
}
dropDownHotel()
</script>
