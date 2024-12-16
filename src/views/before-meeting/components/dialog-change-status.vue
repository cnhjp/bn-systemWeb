<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules">
                <el-form-item label="状态" prop="attendStatus">
                    <el-radio-group v-model="formModel.attendStatus">
                        <el-radio v-for="item in drop" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </el-main>

        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { getPersonAttendStatusDrop } from '~/src/api/common'
import { batchConventionPersonAttendtSatus } from '~/src/api/before-meeting/personnel'

const props = defineProps({
    personIdList: {
        type: Array,
        default: () => [],
    },
    conventionId: {
        type: [String, Number],
        default: '',
    },
})

const drop = ref([])

onMounted(() => {
    getPersonAttendStatusDrop({ conventionId: props.conventionId }).then((res) => {
        drop.value = (res?.data || [])
            .filter((item) => +item.value !== 3 && !!item.value)
            .map((item) => {
                return {
                    ...item,
                    value: +item.value,
                }
            })
    })
})

const formModel = reactive({
    conventionPersonIdList: props.personIdList,
    attendStatus: '',
})
const formRules = reactive({
    attendStatus: { required: true, message: '请选择状态' },
})

const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}

const refForm = ref()
function onConfirm() {
    refForm.value.validate().then(() => {
        batchConventionPersonAttendtSatus(formModel).then(() => {
            ElMessage.success('操作成功')
            onClose()
            emits('refresh')
        })
    })
}
</script>
