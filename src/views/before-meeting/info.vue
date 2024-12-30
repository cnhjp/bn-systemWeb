<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">添加会议</el-button>
                    <el-button type="primary" @click="onGroup">分组管理</el-button>
                </template>
                <template #toolbar-right>
                    <el-form inline>
                        <el-form-item label="会议类型">
                            <b-select v-model="formModel.conventionType" :data="getMeetingTypeDrop"></b-select>
                        </el-form-item>
                        <el-form-item label="会议状态">
                            <b-select
                                multiple
                                v-model="formModel.conventionStatusList"
                                :data="StatusDrop"
                                @change="onRefresh"
                            ></b-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="formModel.keyword"
                                placeholder="请输入会议名称"
                                clearable
                                @keyup.enter="onRefresh"
                                @clear="onRefresh"
                            >
                                <template #append>
                                    <el-button icon="Search" @click="onRefresh" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>

                <template #sortIndex="{ row }">
                    <el-input v-model="row.sortIndex" @blur="onEditSortIndex(row)" class="!w-full"></el-input>
                </template>

                <template #qrCode="{ row }">
                    <b-image
                        class="w-30px h-30px"
                        :file-name="row.conventionName"
                        :src="row.qrCode"
                        :preview-src-list="[row.qrCode]"
                    />
                </template>

                <template #conventionStatus="{ row }">
                    <b-select v-model="row.conventionStatus" :data="StatusDrop" @change="onEditStatus(row)"></b-select>
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import {
    getMeetingTypeDrop,
    getMeetingStatusDrop,
    getMeetingPage,
    editSortIndex,
    editStatus,
    deleteMeeting,
} from '~/src/api/before-meeting/info'

const refGrid = ref<any>(null)
const router = useRouter()

const formModel = reactive({
    conventionName: '',
    conventionType: '',
    year: 0,
    conventionStatusList: [],
    isExpro: false,
    keyword: '',
    tenantId: 0,
})

const gridProps = reactive({
    data: getMeetingPage,
    query: (params) => {
        return Object.assign(params, formModel, {
            conventionType: +formModel.conventionType,
        })
    },
    columns: [
        { title: '排序', slots: { default: 'sortIndex' }, width: 120, align: 'center' },
        { title: '名称', field: 'conventionName', minWidth: 180, align: 'center' },
        { title: '二维码', slots: { default: 'qrCode' }, minWidth: 120, align: 'center' },
        { title: '日期', field: 'conventionMeetingTimeStr', minWidth: 120, align: 'center' },
        { title: '类型', field: 'conventionType', minWidth: 80, align: 'center' },
        { title: '状态', slots: { default: 'conventionStatus' }, width: 100, align: 'center' },
        { title: '操作', slots: { default: 'actions' }, minWidth: 140, fixed: 'right', align: 'center' },
    ],
})

function onRefresh() {
    nextTick(() => {
        refGrid.value.refresh()
    })
}

const StatusDrop = ref([])
function onGetStatusDrop() {
    getMeetingStatusDrop().then((res) => {
        StatusDrop.value = (res.data || []).map((item) => {
            return {
                ...item,
                value: +item.value,
            }
        })
    })
}
onMounted(onGetStatusDrop)

function onEditSortIndex(row) {
    editSortIndex(row).then(() => {
        ElMessage.success('操作成功')
        onRefresh()
    })
}

function onEditStatus(row) {
    editStatus(row.conventionID, row.conventionStatus).then(() => {
        ElMessage.success('操作成功')
        onRefresh()
    })
}

function onDelete(row) {
    ElMessageBox.confirm('确定删除该会议吗？').then(() => {
        deleteMeeting(row.conventionID).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

function onAdd() {
    router.push({
        name: 'before-meeting-info-add',
        query: {
            step: 1,
        },
    })
}

function onEdit(row) {
    router.push({
        name: 'before-meeting-info-edit',
        query: {
            id: row.conventionID,
        },
    })
}

function onGroup() {
    router.push({ name: 'before-meeting-info-group' })
}
</script>
