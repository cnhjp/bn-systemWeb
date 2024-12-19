<template>
    <el-container class="wh-full">
        <el-header class="!h-auto !pt-12px" v-if="active">
            <stepHeader class="mb-20px" />
            <div class="flex items-center mb-10px">
                <meetingDropForm
                    :disabled="!!route.query.conventionId"
                    v-model="formModel.conventionId"
                    @change="getTabs"
                />
                <el-button type="primary" @click="onOpenCopyPersonnelDialog" class="relative ml-20px">
                    复制其他会议人员
                </el-button>
            </div>
        </el-header>
        <el-main class="!pt-0" v-if="active">
            <el-tabs v-model="activeTab" class="h-full" @tab-change="onRefresh">
                <el-tab-pane :label="`参会人员(${tabCounts.attendMeetingCount})`" name="参会人员" class="h-full">
                    <panticipate-grid
                        ref="refPanticipateGrid"
                        :conventionId="formModel.conventionId"
                        v-if="activeTab === '参会人员'"
                    ></panticipate-grid>
                </el-tab-pane>
                <el-tab-pane :label="`工作人员(${tabCounts.operaterCount})`" name="工作人员" class="h-full">
                    <staff-grid
                        ref="refStaffGrid"
                        :conventionId="formModel.conventionId"
                        v-if="activeTab === '工作人员'"
                    ></staff-grid>
                </el-tab-pane>
            </el-tabs>
        </el-main>

        <el-main class="wh-full bg-white !flex-center" v-else>
            <div class="font-bold text-center text-3xl">没有预备/公布的大会</div>
        </el-main>

        <el-footer v-if="hasFooter">
            <div class="flex-center">
                <el-button @click="onPreviousStep">返回上一步</el-button>
                <el-button type="primary" @click="onNextStep">下一步</el-button>
            </div>
        </el-footer>

        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { hasActive } from '~/src/api/common'
import { getConventionPersonTabCount } from '~/src/api/before-meeting/personnel'
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'
import dialogCopyPersonnel from './components/dialog-copy-personnel.vue'
import panticipateGrid from './components/panticipate-grid.vue'
import staffGrid from './components/staff-grid.vue'
import stepHeader from './components/step-header.vue'
import { router } from '~/src/router'

provide('beforeMeetingPersonnel', {
    getTabs,
})

const active = ref(false)
const route = useRoute()

onMounted(() => {
    hasActive().then((res) => {
        active.value = res.data
    })
})

const formModel = reactive({
    conventionId: route.query.conventionId ? +route.query.conventionId : '',
})

const refDialog = ref<any>(null)

function onOpenCopyPersonnelDialog() {
    refDialog.value.openModal({
        component: dialogCopyPersonnel,
        title: '复制会议人员',
        width: '480px',
        params: {
            meetingId: formModel.conventionId,
        },
    })
}

const activeTab = ref('参会人员')
const tabCounts = reactive({
    attendMeetingCount: 0,
    operaterCount: 0,
})
function getTabs() {
    getConventionPersonTabCount({ conventionId: formModel.conventionId }).then((res) => {
        tabCounts.attendMeetingCount = res.data.attendMeetingCount
        tabCounts.operaterCount = res.data.operaterCount
    })
}

const refPanticipateGrid = ref<any>(null)
const refStaffGrid = ref<any>(null)

function onRefresh() {
    nextTick(() => {
        refPanticipateGrid.value?.onRefresh?.()
        refStaffGrid.value?.onRefresh?.()
        getTabs()
    })
}

const hasFooter = computed(() => route.query.step)
function onPreviousStep() {
    router.push({
        name: 'before-meeting-info-edit',
        query: {
            step: 1,
            conventionId: formModel.conventionId,
            id: formModel.conventionId,
        },
    })
}
function onNextStep() {
    router.push({
        name: 'before-meeting-material',
        query: {
            step: 3,
            conventionId: formModel.conventionId,
        },
    })
}
</script>
