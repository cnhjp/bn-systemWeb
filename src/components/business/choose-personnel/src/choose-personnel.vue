<template>
    <el-container>
        <el-main class="!p-0">
            <b-grid ref="refGrid" v-bind="computedGridProps">
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
const props = defineProps({
    gridProps: {
        type: Object,
        default: () => ({}),
    },
})

const router = useRouter()

const formModel = reactive({
    keyword: '',
})

const refGrid = ref()

const computedGridProps = computed(() => {
    return {
        ...props.gridProps,
        height: props.gridProps.height ? props.gridProps.height : 600,
        query: (params) => {
            return Object.assign(params, formModel)
        },
    }
})

function onAdd() {
    router.push({ name: 'personnel-manage' })
}

function onRefresh() {
    refGrid.value.refresh()
}

const emits = defineEmits(['close', 'choosePersonnel'])

function onClose() {
    emits('close')
}

function onConfirm() {
    const selected = refGrid.value.getSelected()
    if (selected.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    emits('choosePersonnel', selected, onClose)
}
</script>
