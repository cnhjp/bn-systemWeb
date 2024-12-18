<template>
    <el-container class="wh-full">
        <el-main>
            <div class="el-bg--white el-flex p-20px">
                <div class="el-bg--grey p-20px room-list">
                    <div class="el-flex is-center-between mb-15px">
                        <h3 class="el-text--darkgrey">会议室列表</h3>
                        <el-button type="primary" plain size="small" @click="onAddRoom">新增</el-button>
                    </div>
                    <el-input
                        v-model="keyword"
                        placeholder="会议室名称"
                        clearable
                        @keyup.enter="onRefresh"
                        @clear="onRefresh"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                    <div class="list-wapper">
                        <div
                            class="item el-flex is-center-between el-border el-round is-mini p-10px my-10px"
                            :class="{ 'is-primary el-text--primary active': active === index }"
                            v-for="(item, index) in meetingRoomList"
                            :key="`room${index}`"
                            @click="onChangeRoom(index)"
                        >
                            <template v-if="item.edit">
                                <el-input v-model="item.roomName" />
                                <div class="link-group">
                                    <el-link type="primary" class="mx-5px" @click.stop="onConfirm(item)">确定</el-link>
                                    <el-link type="primary" @click.stop="onCancel(item, index)">取消</el-link>
                                </div>
                            </template>
                            <template v-else>
                                <div class="el-line1">
                                    {{ item.roomName }}
                                </div>
                                <div class="icon-group" v-if="active === index">
                                    <el-icon class="mr-15px" @click.stop="onEditRoom(item)"><EditPen /></el-icon>
                                    <el-icon @click.stop="onDelete(item)"><Delete /></el-icon>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div v-if="visible" class="event-wrapper pl-20px">
                    <h1 class="el-text--darkgrey"></h1>
                    <!--                    <calendar :eventList="eventList" />-->
                    <list :meetingRoom="currentRoom" :eventList="eventList" />
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
// import Calendar from './components/calendar.vue'
import {
    addMeetingRoom,
    getMeetingRoomPage,
    deleteMeetingRoom,
    getMeetingRoomEventList,
    editMeetingRoom,
} from '@/api/meeting-manage'
import { ElMessage } from 'element-plus'
import List from './components/list.vue'

const visible = ref<boolean>(false)
const keyword = ref<string>('')
const meetingRoomList = ref<any[]>([])
const active = ref<number>(0)
const currentRoom = ref<any>(null)

watch(
    () => active.value,
    (value) => {
        currentRoom.value = meetingRoomList.value[value]
    },
)

function onRefresh() {}

function onChangeRoom(index: number) {
    active.value = index
    visible.value = false
    getEventList()
}

//添加
function onAddRoom() {
    active.value = 0
    meetingRoomList.value.unshift({
        roomName: '',
        meetingRoomID: 0,
        edit: true,
    })
}

function onCancel(item: any, index: number) {
    if (item.roomName) {
        item.edit = false
    } else {
        meetingRoomList.value.splice(index, 1)
    }
}

function onConfirm(item: any) {
    if (!item.roomName) {
        ElMessage.warning('会议室名称不能为空')
        return
    }
    const api = item.meetingRoomID ? editMeetingRoom : addMeetingRoom
    api(item).then(() => {
        item.edit = false
        ElMessage.success('操作成功')
    })
}

function onEditRoom(item: any) {
    item.edit = true
}

function onDelete(item: any) {
    ElMessageBox.confirm('确定删除该会议室吗？').then(() => {
        deleteMeetingRoom(item.meetingRoomID).then(() => {
            ElMessage.success('操作成功')
            init()
        })
    })
}

// 会议室预约列表
const eventList = ref([])
async function getEventList() {
    const currentRoom = meetingRoomList.value[active.value]
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const query = {
        startTime: firstDayOfMonth,
        meetingRoomID: currentRoom.meetingRoomID,
    }
    await getMeetingRoomEventList(query).then((res) => {
        eventList.value = res.data
        visible.value = true
    })
}

async function init() {
    const query = {
        keyword: keyword.value,
        pageIndex: 1,
        pageSize: 9999,
    }
    await getMeetingRoomPage(query).then((res) => {
        meetingRoomList.value = res.data?.rows
        currentRoom.value = meetingRoomList.value[0]
    })
    await getEventList()
}
init()
</script>

<style scoped lang="scss">
.el-bg--white {
    height: 100%;
}
.room-list {
    width: 300px;
    flex-shrink: 0;
    .item {
        cursor: pointer;
        background-color: white;
        .link-group {
            width: 100px;
        }
        .icon-group {
            width: 50px;
            flex-shrink: 0;
        }
    }
    .active {
        background: var(--el-color-theme-light-9);
    }
}
.event-wrapper {
    width: calc(100% - 300px);
}
</style>
