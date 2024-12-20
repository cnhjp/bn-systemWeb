<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #status="{ row }">
                    {{ getStatus(row) }}
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

const router = useRouter()

const gridProps = reactive({
    data: getOnlineConsultationPage,
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

function onReply(row: any) {
    router.push({ name: 'online-consultation-detail', query: { id: row.id } })
}
</script>
