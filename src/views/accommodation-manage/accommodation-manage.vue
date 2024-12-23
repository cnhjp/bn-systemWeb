<template>
    <el-container class="wh-full">
        <el-header height="100px">
            <div class="el-flex pt-20px pb-10px">
                会议：
                <el-select v-model="meetingId" class="meeting" @change="onRefresh">
                    <el-option v-for="item in dropMeeting" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
            <el-tabs v-model="activeTab" class="demo-tabs">
                <el-tab-pane label="住宿人员" name="first" />
                <el-tab-pane label="住宿安排" name="second" />
            </el-tabs>
        </el-header>
        <el-main v-if="visible">
            <person-list ref="" :meetingId="meetingId" v-if="activeTab === 'first'" />
            <accommodation-list :meetingId="meetingId" v-else />
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import PersonList from './components/person-list.vue'
import AccommodationList from './components/accommodation-list.vue'
import { dropDownMeeting } from '@/api/common'
import { DropResponse } from '@/api/accommodation-manage/types.ts'
import { nextTick } from 'vue'

const activeTab = ref<string>('first')
const visible = ref<boolean>(false)
const dropMeeting = ref<DropResponse[]>([])
const meetingId = ref()

function onRefresh() {
    visible.value = false
    nextTick(() => {
        visible.value = true
    })
}
function init() {
    dropDownMeeting().then((res) => {
        dropMeeting.value = res.data
        if (dropMeeting.value.length > 0) {
            meetingId.value = dropMeeting.value[0].value
        }
        visible.value = true
    })
}
init()
</script>

<style scoped lang="scss">
.meeting {
    width: 400px;
}
</style>
