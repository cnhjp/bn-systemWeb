<template>
    <el-container class="wh-full">
        <el-header class="flex items-center">
            <meetingDropForm v-model="formModel.conventionId" />
            <el-button type="primary" @click="onCategory" class="relative left--20px">分类管理</el-button>
        </el-header>
        <el-main class="!pt-0">
            <div class="flex justify-between h-32px">
                <div class="tabs">
                    <div
                        v-for="item in categoryList"
                        :key="item.name"
                        :class="{
                            tab: true,
                            active: item.categoryID === activeCategory?.categoryID,
                        }"
                        @click="onChangeCategory(item)"
                    >
                        {{ item.name }}
                    </div>
                </div>
                <div class="right">
                    <el-button type="primary" @click="onUploadAgenda" v-if="false">一键上传议程</el-button>
                    <el-button type="primary" v-if="activeCategory.isDefault">添加议程</el-button>
                    <el-button type="primary" @click="onUploadFile" v-else>添加文件</el-button>
                    <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
                </div>
            </div>
            <div class="grid">
                <material-grid :list="list" />
            </div>
        </el-main>

        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { getCategoryList } from '~/src/api/before-meeting/material'
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'
import materialGrid from './components/material-grid.vue'
import dialogUploadAgenda from './components/dialog-upload-agenda.vue'
import dialogUploadMaterialFile from './components/dialog-upload-material-file.vue'
import { getDefaultMaterialList, getNonDefaultMaterialList, deleteAgendaFiles } from '~/src/api/before-meeting/material'

const router = useRouter()

provide('material', {
    onRefresh,
    onToggleAgendaIds,
    onToggleFileIds,
})

const formModel = reactive({
    conventionId: '',
})

const agendaDocumentIds = []
const agendaIds = []
function onToggleAgendaIds(id) {
    agendaIds.includes(id) ? agendaIds.splice(agendaIds.indexOf(id), 1) : agendaIds.push(id)
}
function onToggleFileIds(id) {
    agendaDocumentIds.includes(id)
        ? agendaDocumentIds.splice(agendaDocumentIds.indexOf(id), 1)
        : agendaDocumentIds.push(id)
}

function onCategory() {
    router.push({
        name: 'before-meeting-material-category',
        query: {
            conventionId: formModel.conventionId,
        },
    })
}

const categoryList = ref([])
const activeCategory = ref<any>({})
function onGetCategoryList() {
    if (!formModel.conventionId) return
    getCategoryList({ conventionId: formModel.conventionId }).then((res) => {
        categoryList.value = res.data || []
        if (!categoryList.value.length) return
        // 找到isDefault为true的那个
        activeCategory.value = categoryList.value.find((item) => item.isDefault)
        if (!activeCategory.value) {
            activeCategory.value = categoryList.value[0]
        }
    })
}
function onChangeCategory(item) {
    activeCategory.value = item
}

const list = ref<any>([])
function onRefresh() {
    nextTick(() => {
        const api = activeCategory.value.isDefault ? getDefaultMaterialList : getNonDefaultMaterialList
        api({ conventionId: formModel.conventionId, categoryId: activeCategory.value.categoryID }).then(({ data }) => {
            list.value = data || []
        })
    })
}

const refDialog = ref(null)

function onUploadAgenda() {
    refDialog.value.openModal({
        component: dialogUploadAgenda,
        title: '一键上传议程',
        width: '680px',
        params: {
            conventionId: formModel.conventionId,
        },
    })
}

function onUploadFile() {
    refDialog.value.openModal({
        component: dialogUploadMaterialFile,
        title: '添加文件',
        width: '680px',
        params: {
            categoryID: activeCategory.value.categoryID,
            conventionId: formModel.conventionId,
            folderID: 0,
        },
    })
}

function onBatchDelete() {
    if (agendaDocumentIds.length === 0 && agendaIds.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    ElMessageBox.confirm('确定删除选中的议程吗？').then(() => {
        deleteAgendaFiles({ agendaDocumentIds, agendaIds }).then(() => {
            ElMessage.success('删除成功')
            onRefresh()
        })
    })
}

watch(() => formModel.conventionId, onGetCategoryList, { immediate: true })
watch(
    () => activeCategory.value,
    () => {
        onRefresh()
    },
)
</script>

<style lang="scss" scoped>
.tabs {
    @apply flex flex-1 items-center border-b-1px border-gray-300 overflow-x-auto;
}

.tab {
    @apply cursor-pointer px-12px   pb-8px flex-shrink-0 text-sm;
    &.active {
        @apply border-b-2px border-primary text-primary;
    }
}

.grid {
    height: calc(100% - 52px);
    @apply mt-12px;
}
</style>
