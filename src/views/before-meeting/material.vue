<template>
    <el-container class="wh-full">
        <el-header class="!h-auto" v-if="active">
            <stepHeader class="mb-20px" />
            <div class="flex items-center mb-10px">
                <meetingDropForm v-model="formModel.conventionId" />
                <el-button type="primary" @click="onCategory" class="relative left--20px">分类管理</el-button>
            </div>
        </el-header>
        <el-main class="!pt-0" v-if="active">
            <el-container class="wh-full">
                <el-header>
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
                            <el-button type="primary" @click="onAddAgenda">添加议程</el-button>
                            <el-button type="primary" @click="onUploadFile" v-if="!activeCategory.isDefault">
                                添加文件
                            </el-button>
                            <el-button type="danger" @click="onBatchDelete">批量删除</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main class="!p-10px bg-#eef2fb">
                    <el-scrollbar class="wh-full">
                        <material-grid :list="list" />
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-main>

        <el-main class="wh-full bg-white !flex-center" v-else>
            <div class="font-bold text-center text-3xl">没有预备/公布的大会</div>
        </el-main>

        <el-footer v-if="hasFooter">
            <div class="flex-center">
                <el-button @click="onPreviousStep">返回上一步</el-button>
                <el-button type="primary" @click="onNextStep">保存</el-button>
            </div>
        </el-footer>

        <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
    </el-container>
</template>

<script setup lang="ts">
import { hasActive } from '~/src/api/common'
import { getCategoryList } from '~/src/api/before-meeting/material'
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'
import materialGrid from './components/material-grid.vue'
import dialogUploadAgenda from './components/dialog-upload-agenda.vue'
import dialogUploadMaterialFile from './components/dialog-upload-material-file.vue'
import { getDefaultMaterialList, getNonDefaultMaterialList, deleteAgendaFiles } from '~/src/api/before-meeting/material'
import dialogAgendaForm from './components/dialog-agenda-form.vue'
import stepHeader from './components/step-header.vue'

const router = useRouter()
const route = useRoute()

provide('material', {
    onRefresh,
    setAgendaIds,
    setAgendaDocumentIds,
    openFormDialog,
    getConventionId,
})

const active = ref(false)

onMounted(() => {
    hasActive().then((res) => {
        active.value = res.data
    })
})

const formModel = reactive({
    conventionId: '',
})

let agendaDocumentIds = []
let agendaIds = []
function setAgendaIds(ids) {
    agendaIds = ids
}

function setAgendaDocumentIds(ids) {
    agendaDocumentIds = ids
}
function getConventionId() {
    return formModel.conventionId
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

function openFormDialog(params) {
    refDialog.value.openModal({
        component: dialogAgendaForm,
        width: '680px',
        ...params,
    })
}

function onAddAgenda() {
    openFormDialog({
        title: '添加议程',
        params: {
            agendaID: 0,
            parentID: 0,
            hideUpload: false,
            conventionID: formModel.conventionId,
        },
    })
}

watch(() => formModel.conventionId, onGetCategoryList, { immediate: true })
watch(
    () => activeCategory.value,
    () => {
        onRefresh()
    },
)

const hasFooter = computed(() => route.query.step)
function onPreviousStep() {
    router.back()
}
function onNextStep() {
    router.push({
        name: 'before-meeting-info',
    })
}
</script>

<style lang="scss" scoped>
.tabs {
    @apply flex flex-1 items-center border-b-1px border-gray-300 overflow-x-auto;
}

.tab {
    @apply cursor-pointer px-12px pb-8px flex-shrink-0 text-sm;
    &.active {
        @apply border-b-2px border-primary text-primary;
    }
}
</style>
