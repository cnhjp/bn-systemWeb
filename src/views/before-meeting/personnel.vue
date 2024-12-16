<template>
    <el-container class="wh-full">
        <el-header class="flex items-center">
            <meetingDropForm v-model="formModel.conventionId" @change="getTabs" />
            <el-button type="primary" @click="onOpenCopyPersonnelDialog" class="relative left--20px">
                复制其他会议人员
            </el-button>
        </el-header>
        <el-main class="!pt-0">
            <el-tabs v-model="activeTab" class="h-full">
                <el-tab-pane :label="`参会人员(${tabCounts.attendMeetingCount})`" name="参会人员" class="h-full">
                    <panticipate-grid :conventionId="formModel.conventionId"></panticipate-grid>
                </el-tab-pane>
                <el-tab-pane :label="`工作人员(${tabCounts.operaterCount})`" name="工作人员">
                    <staff-grid :conventionId="formModel.conventionId"></staff-grid>
                </el-tab-pane>
            </el-tabs>
        </el-main>

        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { getConventionPersonTabCount } from '~/src/api/before-meeting/personnel'
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'
import dialogCopyPersonnel from './components/dialog-copy-personnel.vue'
import panticipateGrid from './components/panticipate-grid.vue'
import staffGrid from './components/staff-grid.vue'

provide('beforeMeetingPersonnel', {
    getTabs,
})

const formModel = reactive({
    conventionId: '',
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

function onRefresh() {
    console.log('刷新')
}
</script>
