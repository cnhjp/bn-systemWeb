<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-right>
                    <el-select v-model="formModel.conventionGroupId" class="meeting-select" @change="onRefresh">
                        <el-option
                            v-for="item in dropMeeting"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
                <template #status="{ row }">
                    <el-tag :type="getStatusType(row)" v-if="row.status">{{ getStatus(row) }}</el-tag>
                </template>
                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onReply(row)">答复</el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getOnlineConsultationPage } from '@/api/online-consultation'
import { DropResponse } from '@/api/common/types.ts'
import { dropDownConvention } from '@/api/common'

const router = useRouter()

const formModel = ref({
    conventionGroupId: 0,
})

const gridProps = reactive({
    autoLoad: false,
    data: getOnlineConsultationPage,
    query: (params: any) => {
        return Object.assign(params, formModel.value)
    },
    columns: [
        { title: '用户', field: 'name', minWidth: 100 },
        { title: '问题', field: 'title', minWidth: 200 },
        { title: '状态', slots: { default: 'status' }, minWidth: 100 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
})

function getStatus(row: any) {
    switch (row.status) {
        case 1:
            return '未答复'
        case 2:
            return '已答复'
        case 3:
            return '已关闭'
    }
}
function getStatusType(row: any) {
    switch (row.status) {
        case 1:
            return 'danger'
        case 2:
            return 'success'
        case 3:
            return 'info'
    }
}
const refGrid = ref<any>(null)

function onRefresh() {
    refGrid.value.refresh()
}

function onReply(row: any) {
    router.push({ name: 'online-consultation-detail', query: { id: row.id } })
}
const dropMeeting = ref<DropResponse[]>([])
async function init() {
    await dropDownConvention().then((res) => {
        dropMeeting.value = res.data
        formModel.value.conventionGroupId = dropMeeting.value.length > 0 ? dropMeeting.value[0].value : null
    })
    onRefresh()
}
init()
</script>
