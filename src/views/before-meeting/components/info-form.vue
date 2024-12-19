<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="id ? '编辑' : '新增'" is-show-btn></page-header>
        </el-header>
        <el-main class="bg-white m-20px">
            <div class="flex justify-between">
                <div class="flex-1 mr-10px">
                    <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="12em" label-suffix=":">
                        <el-form-item label="会议名称" prop="title">
                            <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formModel.title"
                                maxlength="200"
                                show-word-limit
                                class="w-full"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="会议分组" prop="conventionGroupID">
                            <b-select v-model="formModel.conventionGroupID" :data="getGroupDrop"></b-select>
                        </el-form-item>

                        <el-form-item label="会议时间" prop="meetingTimeList">
                            <template v-for="item of formModel.meetingTimeList">
                                <el-row :gutter="2" class="w-full">
                                    <el-col :span="11">
                                        <el-date-picker
                                            placeholder="开始时间"
                                            v-model="item.startTime"
                                            type="datetime"
                                            value-format="YYYY-MM-DDTHH:mm:ss"
                                            format="YYYY-MM-DD HH:mm"
                                            class="!w-full"
                                        />
                                    </el-col>
                                    <el-col :span="2">
                                        <div class="text-center">至</div>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-date-picker
                                            placeholder="结束时间"
                                            v-model="item.endTime"
                                            type="datetime"
                                            value-format="YYYY-MM-DDTHH:mm:ss"
                                            format="YYYY-MM-DD HH:mm"
                                            class="!w-full"
                                        />
                                    </el-col>
                                </el-row>
                            </template>
                        </el-form-item>

                        <el-form-item label="会议地点" prop="address">
                            <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formModel.address"
                                show-word-limit
                                class="w-full"
                            ></el-input>
                        </el-form-item>

                        <el-form-item label="会议室">
                            <div class="flex w-full">
                                <b-select
                                    v-model="formModel.meetingRoomID"
                                    :data="getMeetingRoomList"
                                    :query="{ includeUnknown: true }"
                                    class="mr-10px flex-1"
                                ></b-select>
                                <el-button type="primary" @click="onRoomManage" class="w-100px">添加会议室</el-button>
                            </div>
                        </el-form-item>

                        <el-form-item label="会议类型" prop="conventionTypeID">
                            <div class="flex w-full">
                                <b-select
                                    :key="activatedCount"
                                    v-model="formModel.conventionTypeID"
                                    :data="conventionTypeList"
                                    :filter="(option) => !!option.value"
                                    class="mr-10px flex-1"
                                ></b-select>
                                <el-button type="primary" @click="onTypeSetting" class="w-100px">类型配置</el-button>
                            </div>
                        </el-form-item>

                        <el-form-item label="会议会徽" prop="appIndexIsShowEmblem">
                            <el-switch v-model="formModel.appIndexIsShowEmblem"></el-switch>
                        </el-form-item>

                        <el-form-item label="会议坐席牌" prop="isShowPersonName">
                            <el-switch v-model="formModel.isShowPersonName"></el-switch>
                        </el-form-item>

                        <el-form-item label="会议日程" prop="isShowMeetingSchedule">
                            <el-switch v-model="formModel.isShowMeetingSchedule"></el-switch>
                        </el-form-item>

                        <el-form-item label="会议文件带走" prop="isShowFileQrCode">
                            <el-switch v-model="formModel.isShowFileQrCode"></el-switch>
                        </el-form-item>

                        <el-form-item label="允许补签" prop="allowSign">
                            <el-switch v-model="formModel.allowSign" />
                        </el-form-item>

                        <el-form-item label="签到结果显示">
                            <el-checkbox v-model="formModel.isShowResultLeave">请假人数</el-checkbox>
                            <el-checkbox v-show="formModel.allowSign" v-model="formModel.isShowResultNotPress">
                                未按人数
                            </el-checkbox>
                            <el-checkbox v-show="!formModel.allowSign" v-model="formModel.isShowResultAbsent">
                                缺席人数
                            </el-checkbox>
                            <el-checkbox v-show="!formModel.allowSign" v-model="formModel.isShowResultBoth">
                                请假缺席人数
                            </el-checkbox>
                        </el-form-item>

                        <el-form-item label="会前签到" prop="preConventionSignInType">
                            <el-switch v-model="formModel.hasPreConventionSignInType" class="mr-16px" />
                            <el-radio-group
                                v-show="formModel.hasPreConventionSignInType"
                                v-model="formModel.preConventionSignInType"
                            >
                                <el-radio :value="1">按键签到</el-radio>
                                <el-radio :value="2">手写签到</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item v-if="formModel.preConventionSignInType !== 0" label="签到后才可看文件">
                            <el-switch v-model="formModel.isDocNeedSignIn" />
                        </el-form-item>

                        <el-form-item
                            v-if="formModel.preConventionSignInType !== 0"
                            label="是否开启签到须知"
                            prop="signInPolicy"
                        >
                            <el-switch v-model="formModel.isSignInPolicy" class="mr-16px" />
                            <el-input
                                v-if="formModel.isSignInPolicy"
                                v-model="formModel.signInPolicy"
                                type="textarea"
                                :rows="8"
                                placeholder="请输入签到须知"
                            />
                        </el-form-item>
                    </el-form>

                    <div class="flex w-full justify-center mt-20px">
                        <el-button @click="onCancel">取消</el-button>
                        <el-button type="primary" @click="onConfirm">保存</el-button>
                    </div>
                </div>
                <infoPreview :formModel="formModel" />
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { useRouteStore } from '~/src/store'
import infoPreview from './info-preview.vue'
import {
    getGroupDrop,
    getMeetingRoomList,
    conventionTypeList,
    addMeeting,
    editMeeting,
    getMeetingDetail,
} from '~/src/api/before-meeting/info'

const router = useRouter()
const routeStore = useRouteStore()
const props = defineProps(['id'])
const activatedCount = ref(1)
const refForm = ref<any>(null)

const formModel = reactive<any>({
    id: props.id,
    title: '',
    conventionGroupID: '',
    meetingTimeList: [{ startTime: '', endTime: '' }],
    address: '',
    meetingRoomID: '',
    conventionTypeID: '',
    isShowMeetingSchedule: false,
    isShowPersonName: true,
    appIndexIsShowEmblem: true,
    isShowFileQrCode: true,
    allowSign: false,
    isShowResultLeave: true,
    isShowResultNotPress: false,
    isShowResultAbsent: false,
    isShowResultBoth: false,
    hasPreConventionSignInType: true,
    preConventionSignInType: 1,
    signInPolicy: '',
    isSignInPolicy: false,
    isDocNeedSignIn: false,
})

const formRules = reactive({
    title: { required: true, message: '请输入会议名称' },
    conventionGroupID: { required: true, message: '请选择会议分组' },
    meetingTimeList: {
        required: true,
        validator: (_val, _rule, cb) => {
            if (formModel.meetingTimeList[0].startTime && formModel.meetingTimeList[0].endTime) {
                cb()
            } else {
                cb('请选择会议时间')
            }
        },
    },
    conventionTypeID: { required: true, message: '请选择会议类型' },
})

function onRoomManage() {
    onBeforeRouteLeave()
    router.push({ name: 'room-manage' })
}

function onTypeSetting() {
    onBeforeRouteLeave()
    router.push({ name: 'before-meeting-info-type-setting' })
}

function onBeforeRouteLeave() {
    const name = formModel.id ? 'info-edit' : 'info-add'
    routeStore.cacheRoutes.push(name)
}

function onCancel() {
    router.back()
}

function onConfirm() {
    refForm.value.validate().then(() => {
        const api = formModel.id ? editMeeting : addMeeting
        formModel.meetingRoomID = +formModel.meetingRoomID
        api(formModel).then(() => {
            ElMessage.success('操作成功')
            router.back()
        })
    })
}

function onGetDetail() {
    getMeetingDetail(formModel.id).then((res) => {
        Object.assign(formModel, res.data)
    })
}

onMounted(() => {
    if (props.id) {
        onGetDetail()
    }
})

onActivated(() => {
    const name = formModel.id ? 'info-edit' : 'info-add'
    const idx = routeStore.cacheRoutes.indexOf(name)
    if (idx !== -1) {
        routeStore.cacheRoutes.splice(idx, 1)
    }
    activatedCount.value++
})
</script>

<style lang="scss" scoped></style>
