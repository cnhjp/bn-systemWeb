<template>
    <el-form ref="formRef" :model="formModel" :rules="formRules">
        <div class="el-flex is-center-between">
            <h3 class="is-bold el-text--darkgrey">设置用餐地点</h3>
            <el-link type="danger" @click="onAddAddress">用餐地点管理</el-link>
        </div>
        <div class="address-wrapper py-20px el-border--bottom mb-20px">
            <el-form-item>
                <el-checkbox-group v-model="formModel.addressId">
                    <el-checkbox
                        v-for="address in addressList"
                        :key="address.velue"
                        :label="address.label"
                        :value="address.value"
                    >
                        {{ address.label }}
                    </el-checkbox>
                </el-checkbox-group>
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
                <el-form-item label="结束日期" prop="endDate" class="end-date">
                    <el-date-picker
                        v-model="formModel.endDate"
                        type="date"
                        placeholder="选择结束日期"
                        value-format="x"
                    />
                </el-form-item>
            </div>
        </div>
        <div class="el-flex is-center-between">
            <h3 class="is-bold el-text--darkgrey">设置用餐时间段</h3>
            <el-link type="danger" @click="onAddTime">添加用餐时间段</el-link>
        </div>
        <div class="meal-time py-20px">
            <div
                class="el-bg--grey px-10px py-20px mb-10px"
                v-for="(item, index) in formModel.eatTimeList"
                :key="`time${index}`"
            >
                <div class="el-flex">
                    <el-form-item
                        label="用餐类型"
                        :prop="`eatTimeList.${index}.eatName`"
                        :rules="formRules.eatName"
                        label-width="80px"
                    >
                        <el-input v-model="item.eatName" />
                    </el-form-item>
                    <el-form-item
                        label="开始时间"
                        :prop="`eatTimeList.${index}.beginTime`"
                        :rules="formRules.beginTime"
                        class="eat-time"
                        label-width="80px"
                    >
                        <el-time-picker
                            v-model="item.beginTime"
                            placeholder="选择开始时间"
                            format="HH:mm"
                            value-format="HH:mm"
                        />
                    </el-form-item>
                    <el-form-item
                        label="结束时间"
                        :prop="`eatTimeList.${index}.endTime`"
                        :rules="formRules.endTime"
                        class="eat-time"
                        label-width="80px"
                    >
                        <el-time-picker
                            v-model="item.endTime"
                            placeholder="选择结束时间"
                            format="HH:mm"
                            value-format="HH:mm"
                        />
                    </el-form-item>
                    <el-icon class="el-text--danger ml-10px mt-8px icon" @click="onDeleteTime(index)" v-if="showDelete">
                        <Delete />
                    </el-icon>
                </div>
                <el-form-item label="菜单 " label-width="80px">
                    <el-input v-model="item.eatMenu" type="textarea" :rows="2" />
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
import { addMeals } from '@/api/meal-manage'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const emits = defineEmits(['close', 'refresh'])
const props = defineProps(['addressList', 'conventionGroupId'])

const formRef = ref<FormInstance>()
const formModel = ref<any>({
    conventionGroupId: props.conventionGroupId,
    addressId: [],
    beginDate: null,
    endDate: null,
    eatTimeList: [
        {
            eatName: '',
            beginTime: '',
            endTime: '',
            eatMenu: '',
        },
    ],
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
const checkEndDate = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请输入结束日期')
    } else {
        const startTime = new Date(formModel.value.beginDate)
        const endTime = new Date(value)
        if (formModel.value.beginDate && startTime > endTime) {
            formModel.value.endDate = null
            return callback('结束日期不能小于开始日期')
        } else {
            return callback()
        }
    }
}
const formRules = reactive<FormRules>({
    beginDate: [{ required: true, validator: checkStartDate, trigger: 'blur' }],
    endDate: [{ required: true, validator: checkEndDate, trigger: 'blur' }],
    hotelAddress: [{ required: true, message: '请输入酒店地址', trigger: 'blur' }],
    eatName: [{ required: true, message: '请输入用餐类型', trigger: 'blur' }],
    beginTime: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
    endTime: [{ required: true, message: '请输入结束时间', trigger: 'blur' }],
})

function onAddAddress() {
    router.push({ name: 'meal-manage-address' })
}

const showDelete = ref<boolean>(false)
function onAddTime() {
    formModel.value.eatTimeList.push({
        eatName: '',
        beginTime: '',
        endTime: '',
    })
    showDelete.value = true
}
function onDeleteTime(index: number) {
    formModel.value.eatTimeList.splice(index, 1)
}

function onClose() {
    emits('close')
}

function onConfirm() {
    formRef.value.validate().then((vali) => {
        if (vali) {
            addMeals(formModel.value).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
    })
}
</script>

<style scoped lang="scss">
.end-date,
.eat-time {
    margin-bottom: 18px !important;
    margin-left: 20px;
}
.eat-time {
    width: 235px;
}
.icon {
    cursor: pointer;
}
</style>
