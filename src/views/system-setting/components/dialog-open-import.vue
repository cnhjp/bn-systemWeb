<template>
    <el-container>
        <el-main class="!p-0">
            <div class="flex items-center">
                <el-icon class="mr-20px"><InfoFilled /></el-icon>
                <span>检测到{{ list.length }}条数据账号与系统现有账号重复</span>
            </div>

            <b-grid ref="refGrid" v-bind="gridProps">
                <template #repeat="{ row }">
                    <span>第[{{ row.lineNum }}]行，账号{{ row.userName }}与系统现有账号重复</span>
                </template>
            </b-grid>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onSkip">跳过，不覆盖</el-button>
            <el-button type="primary" @click="onUpdate">更新</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
const props = defineProps({
    list: {
        type: Array,
        default: () => [],
    },
    formData: {
        type: FormData,
        default: () => null,
    },
})

const refGrid = ref<any>(null)

const gridProps = reactive({
    height: '300px',
    data: props.list,
    pagerConfig: false,
    columns: [
        { type: 'checkbox', width: 60, align: 'center' },
        { title: '重复数据', slots: { default: 'repeat' } },
    ],
})

const emits = defineEmits(['close', 'importPersonnel'])

function onClose() {
    emits('close')
}

function getSelectedRows() {
    return refGrid.value.getSelected().map((item: any) => {
        return {
            lineNum: item.lineNum,
            userName: item.userName,
            errorTips: item.errorTips,
        }
    })
}

function onSkip() {
    onClose()
    emits('importPersonnel', props.formData)
}

function onUpdate() {
    const selectedRows = getSelectedRows()
    if (selectedRows.length === 0) {
        ElMessage.warning('请选择至少一条数据')
        return
    }
    props.formData.append('UpdatePersonListJson', JSON.stringify(selectedRows))
    onClose()
    emits('importPersonnel', props.formData)
}
</script>
