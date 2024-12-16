<template>
    <el-container>
        <el-main class="!p-0">
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="onAdd">添加人员</el-button>
                </template>

                <template #toolbar-right>
                    <el-input
                        v-model="formModel.keyword"
                        placeholder="请输入账号、姓名、手机号"
                        clearable
                        @keyup.native.enter="onRefresh"
                        @clear="onRefresh"
                    >
                        <template #append>
                            <el-button icon="Search" @click="onRefresh" />
                        </template>
                    </el-input>
                </template>
            </b-grid>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { getPersonnelPage } from '~/src/api/personnel-manage'
import { addConventionPerson } from '~/src/api/before-meeting/personnel'

const props = defineProps({
    queryParams: {
        type: Object,
        default: () => ({}),
    },
    conventionRole: {
        type: Number,
        default: 0,
    },
})

const router = useRouter()

const formModel = reactive({
    keyword: '',
    conventionID: props.queryParams.conventionId,
    conventionRole: props.conventionRole,
    personIds: [],
})

const refGrid = ref()

const gridProps = reactive({
    height: 600,
    data: getPersonnelPage,
    query: (params) => {
        return Object.assign(params, props.queryParams, formModel)
    },
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '姓名', field: 'name', minWidth: 120, align: 'center' },
        { title: '账号', field: 'userName', minWidth: 120, align: 'center' },
        { title: '手机号', field: 'mobilePhone', minWidth: 120, align: 'center' },
        { title: '分组', field: 'groupNames', minWidth: 120, align: 'center' },
    ],
})

function onAdd() {
    router.push({ name: 'personnel-manage' })
}

function onRefresh() {
    refGrid.value.refresh()
}

const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}

function onConfirm() {
    const selectedIds = refGrid.value.getSelected().map((item: any) => item.personId)
    if (selectedIds.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    formModel.personIds = selectedIds
    addConventionPerson(formModel).then(() => {
        ElMessage.success('操作成功')
        emits('refresh')
        onClose()
    })
}
</script>
