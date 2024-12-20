<template>
    <el-form ref="formRef" :model="formModel" :rules="formRules">
        <div class="el-flex is-center-between">
            <h3 class="is-bold el-text--darkgrey">设置用餐地点</h3>
            <el-link type="danger" @click="onAddAddress">用餐地点管理</el-link>
        </div>
        <div class="address-wrapper py-20px el-border--bottom mb-20px">
            <el-form-item>
                <el-radio-group v-model="formModel.addressId">
                    <el-radio
                        v-for="address in addressList"
                        :key="address.velue"
                        :label="address.label"
                        :value="address.value"
                    >
                        {{ address.label }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="el-flex is-center-between">
            <h3 class="is-bold el-text--darkgrey">设置用餐日期</h3>
        </div>
        <div class="meal-date py-20px mb-20px el-border--bottom">
            <div class="el-flex is-align-center pt-5px">
                <el-form-item label="开始日期" prop="beginDate">
                    <el-date-picker
                        v-model="formModel.beginDate"
                        type="date"
                        placeholder="选择开始日期"
                        value-format="x"
                    />
                </el-form-item>
            </div>
        </div>
        <div class="el-flex is-center-between">
            <h3 class="is-bold el-text--darkgrey">设置用餐时间段</h3>
        </div>
        <div class="meal-time py-20px">
            <div class="el-flex">
                <el-form-item label="用餐类型" prop="eatTime.eatName">
                    <el-input v-model="formModel.eatTime.eatName" />
                </el-form-item>
                <el-form-item label="开始时间" prop="eatTime.beginTime" class="eat-time">
                    <el-time-picker
                        v-model="formModel.eatTime.beginTime"
                        placeholder="选择开始时间"
                        format="HH:mm"
                        value-format="HH:mm"
                    />
                </el-form-item>
                <el-form-item label="结束时间" prop="eatTime.endTime" class="eat-time">
                    <el-time-picker
                        v-model="formModel.eatTime.endTime"
                        placeholder="选择结束时间"
                        format="HH:mm"
                        value-format="HH:mm"
                    />
                </el-form-item>
            </div>
        </div>
    </el-form>
    <div class="el-flex is-center pb-20px">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { editMeals, detailMeals } from '@/api/meal-manage'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const emits = defineEmits(['close', 'refresh'])
const props = defineProps(['addressList', 'conventionID', 'row'])

const formRef = ref<FormInstance>()
const formModel = ref<any>({
    id: props.row.id,
    conventionId: props.conventionID,
    addressId: null,
    beginDate: null,
    eatTime: {
        eatName: '',
        beginTime: '',
        endTime: '',
    },
})

//必填校验
const checkStartDate = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请输入开始日期')
    } else {
        const startTime = new Date(value)
        const endTime = new Date(formModel.value.endDate)
        if (formModel.value.endDate && startTime > endTime) {
            formModel.value.beginDate = null
            return callback('开始日期不能大于结束日期')
        } else {
            return callback()
        }
    }
}

const formRules = reactive<FormRules>({
    beginDate: [{ required: true, validator: checkStartDate, trigger: 'blur' }],
    hotelAddress: [{ required: true, message: '请输入酒店地址', trigger: 'blur' }],
    eatName: [{ required: true, message: '请输入用餐类型', trigger: 'blur' }],
    beginTime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
    endTime: [{ required: true, message: '请输入结束时间', trigger: 'blur' }],
})

function onAddAddress() {
    router.push({ name: 'meal-manage-address' })
}

function onClose() {
    emits('close')
}

function onConfirm() {
    formRef.value.validate().then((vali) => {
        if (vali) {
            editMeals(formModel.value).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
    })
}

function init() {
    detailMeals(props.row.id).then((res) => {
        Object.assign(formModel.value, res.data)
    })
}
init()
</script>

<style scoped lang="scss">
.end-date,
.eat-time {
    margin-bottom: 18px !important;
    margin-left: 20px;
}
.icon {
    cursor: pointer;
}
</style>
