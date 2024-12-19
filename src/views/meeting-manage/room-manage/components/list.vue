<template>
    <div class="wh-full">
        <b-grid ref="refGrid" v-bind="gridProps">
            <template #toolbar-left>
                <h2 class="is-bold el-text--darkgrey p-8px">【{{ meetingRoom.roomName }}】预约日历</h2>
            </template>
            <template #toolbar-right>
                <el-button type="primary" @click="onBookMeetingRoom()">预约会议室</el-button>
            </template>
            <template #time="{ row }">
                {{ DateUtil.formatDate(row.startTime, 'yyyy-MM-dd HH:mm') }} -
                {{ DateUtil.formatDate(row.endTime, 'yyyy-MM-dd HH:mm') }}
            </template>
            <template #actions="{ row }">
                <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
            </template>
        </b-grid>
        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { deleteHotel } from '@/api/hotel-manage'
import { DateUtil } from '@/utils/date-util'
import DialogBookRoom from './dialog-book-room.vue'

const router = useRouter()
const formModel = ref({
    keyword: '',
})
const props = defineProps({
    eventList: {
        type: Array,
        default: () => [],
    },
    meetingRoom: {
        type: Object,
        default: () => {},
    },
})

const gridProps = reactive({
    data: props.eventList,
    query: (params: any) => {
        return Object.assign(params, formModel)
    },
    columns: [
        { title: '会议名称', field: 'conventionTitle', minWidth: 220 },
        { title: '会议时间', slots: { default: 'time' }, minWidth: 220 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
    pagerConfig: false,
})

const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

// 弹窗
const refDialog = ref<any>(null)
function openDialog(params: any) {
    refDialog.value.openModal({
        component: DialogBookRoom,
        title: '预约会议室',
        width: '600px',
        params: {
            ...params,
            list: props.meetingRoom?.meetingRoomID,
        },
    })
}

function onBookMeetingRoom() {
    openDialog({})
}
function onEdit(row: any) {
    router.push({ name: 'hotel-manage-edit', query: { id: row.id } })
}
function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该账号吗？').then(() => {
        deleteHotel(row.id).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}
</script>
