<
<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">新增</el-button>
                </template>
                <template #toolbar-right>
                    <el-form inline>
                        <el-form-item label="会议">
                            <b-select
                                default-first
                                :data="getGroupDrop"
                                v-model="formModel.conventionGroupID"
                                @change="onRefresh"
                            ></b-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="formModel.keyword"
                                placeholder="请输入"
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

                <template #publishTime="{ row }">
                    {{ useDateFormat(row.publishTime, 'YYYY-MM-DD HH:mm') }}
                </template>

                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="onEdit(row)">查看</el-button>
                    <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)" v-if="!row.isMainAdmin">
                        删除
                    </el-button>
                </template>
            </b-grid>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { getNewsPage, deleteNews } from '~/src/api/news-manage'
import { getGroupDrop } from '~/src/api/before-meeting/info'
import { useDateFormat } from '@vueuse/core'

const router = useRouter()
const props = defineProps(['newsType'])

const refGrid = ref<any>(null)

const formModel = reactive({
    keyword: '',
    newsType: props.newsType,
    conventionGroupID: '',
})

const gridProps = reactive({
    autoLoad: false,
    data: getNewsPage,
    query: (params) => {
        return Object.assign(params, formModel, {
            conventionGroupID: formModel.conventionGroupID,
        })
    },
    columns: [
        {
            title: '标题',
            field: 'title',
            minWidth: 200,
        },
        {
            title: '发布时间',
            slots: { default: 'publishTime' },
            minWidth: 200,
        },
        {
            title: '操作',
            slots: { default: 'actions' },
            minWidth: 220,
            fixed: 'right',
            align: 'center',
        },
    ],
})

function onRefresh() {
    nextTick(() => {
        refGrid.value?.refresh()
    })
}

function onAdd() {
    router.push({
        name: 'news-manage-add',
        query: {
            newsType: props.newsType,
        },
    })
}

function onEdit(row) {
    router.push({
        name: 'news-manage-edit',
        query: {
            id: row.id,
        },
    })
}

function onDelete(row) {
    ElMessageBox.confirm('确定删除吗？').then(() => {
        deleteNews(row.id).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

watch(
    () => formModel.conventionGroupID,
    (val) => {
        if (val) onRefresh()
    },
)
</script>
