<template>
    <el-row>
        <el-col :span="20" :offset="2">
            <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                <el-form-item label="会议名称" prop="meetingId">
                    <el-select
                        v-model="formModel.meetingId"
                        placeholder="选择会议"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option
                            v-for="item in meetingDropList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="会议时间" class="is-required">
                    <div class="el-flex is-center">
                        <el-form-item prop="startTime">
                            <el-date-picker
                                v-model="formModel.startTime"
                                type="datetime"
                                placeholder="请选择开始时间"
                                format="YYYY/MM/DD HH:mm"
                                value-format="YYYY-MM-DDTHH:mm"
                            />
                        </el-form-item>
                        <span class="px-5px">至</span>
                        <el-form-item prop="endTime">
                            <el-date-picker
                                v-model="formModel.endTime"
                                type="datetime"
                                placeholder="请选择结束时间"
                                format="YYYY-MM-DD HH:mm"
                                value-format="YYYY-MM-DDTHH:mm"
                            />
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="会议地点" prop="address">
                    <el-input v-model="formModel.address" />
                </el-form-item>
                <el-form-item label="会议室" prop="meetingRoomId">
                    <el-select
                        v-model="formModel.meetingRoomId"
                        placeholder="选择会议室"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option
                            v-for="item in meetingRoomList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="会议类型" prop="conventionTypeID">
                    <el-select
                        v-model="formModel.conventionTypeID"
                        placeholder="选择会议类型"
                        @change="onRefresh"
                        @clear="onRefresh"
                    >
                        <el-option
                            v-for="item in meetingTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <div class="el-text--center mt-25px">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave()">确定</el-button>
    </div>
    <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import {
    addMeetingRoomBook,
    checkMeetingRoomBook,
    dropDownMeetingRoom,
    dropDownMeetingType,
    getMeetingDrop,
} from '@/api/meeting-manage'
import DialogSameTime from './dialog-same-time.vue'

const props = defineProps(['meetingRoomID', 'isEdit', 'conventionId'])
const emits = defineEmits(['close', 'refresh'])

const formRef = ref<FormInstance>()
const formModel = ref<any>({
    conventionId: 0,
    startTime: null,
    endTime: null,
    meetingRoomId: props.meetingRoomID,
    conventionTypeID: null,
    address: '',
    dateList: [],
})
const checkStartTime = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请填写开始时间')
    } else {
        const startTime = new Date(value)
        const endTime = new Date(formModel.value.endTime)
        if (formModel.value.endTime && startTime > endTime) {
            formModel.value.startTime = null
            return callback('开始时间不能大于结束时间')
        } else {
            return callback()
        }
    }
}
const checkEndTime = (rule: any, value: any, callback: any) => {
    console.log(rule, value)
    if (!value) {
        return callback('请填写结束时间')
    } else {
        const startTime = new Date(formModel.value.startTime)
        const endTime = new Date(value)
        if (formModel.value.startTime && startTime > endTime) {
            formModel.value.endTime = null
            return callback('结束时间不能小于开始时间')
        } else {
            return callback()
        }
    }
}
const formRules = reactive<FormRules<any>>({
    conventionId: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
    startTime: [{ required: true, validator: checkStartTime, trigger: 'blur' }],
    endTime: [{ required: true, validator: checkEndTime, trigger: 'blur' }],
    conventionTypeID: [{ required: true, message: '请选择会议类型', trigger: 'blur' }],
})

function onClose() {
    emits('close')
}
function onSave() {
    checkRoomBookTime()
}
// 弹窗
const refDialog = ref<any>(null)
function openDialog(params: any) {
    refDialog.value.openModal({
        component: DialogSameTime,
        title: '提示',
        width: '600px',
        params: {
            list: params,
        },
    })
}

function checkRoomBookTime() {
    const query = {
        conventionId: props.conventionId,
        meetingRoomID: props.meetingRoomID,
        meetingTimeList: [
            {
                startTime: formModel.value.startTime,
                endTime: formModel.value.endTime,
            },
        ],
    }
    checkMeetingRoomBook(query).then((res) => {
        if (res.data.length > 0) {
            openDialog(res.data)
        } else {
            onConfirm()
        }
    })
}

function onConfirm() {
    formModel.value.conventionId = props.conventionId
    formModel.value.dateList = [
        {
            startTime: formModel.value.startTime,
            endTime: formModel.value.endTime,
        },
    ]
    formRef.value.validate().then((vali) => {
        if (vali) {
            console.log(vali)
            addMeetingRoomBook(formModel.value).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
    })
}

//会议下拉
const meetingDropList = ref<any[]>([])
function dropDownMeeting() {
    getMeetingDrop().then((res) => {
        meetingDropList.value = res.data
    })
}
//会议室下拉
const meetingRoomList = ref<any[]>([])
function getMeetingRoomDrop() {
    dropDownMeetingRoom().then((res) => {
        meetingRoomList.value = res.data
    })
}
//会议类型下拉
const meetingTypeList = ref<any[]>([])
function getMeetingTypeDrop() {
    dropDownMeetingType().then((res) => {
        meetingTypeList.value = res.data
    })
}

function init() {
    dropDownMeeting()
    getMeetingRoomDrop()
    getMeetingTypeDrop()
}
init()
</script>

<style scoped lang="scss">
:deep(.el-date-editor) {
    &.el-input,
    &.el-input__wrapper {
        width: 185px;
    }
}
</style>
