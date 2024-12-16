<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules">
                <el-form-item label="会议" prop="selectedConventionId">
                    <b-select :data="MeetingDrop" v-model="formModel.selectedConventionId" class="w-250px"></b-select>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script lang="ts" setup>
import { getMeetingDrop } from '~/src/api/meeting-manage'
import { getCoverByConvention } from '~/src/api/before-meeting/personnel'

const props = defineProps(['meetingId'])
const emits = defineEmits(['close', 'refresh'])

const MeetingDrop = ref([])

const formModel = reactive({
    selectedConventionId: '',
})

const formRules = reactive({
    selectedConventionId: { required: true, message: '请选择会议' },
})

function onClose() {
    emits('close')
}

const refForm = ref<any>(null)
function onConfirm() {
    refForm.value.validate().then(() => {
        getCoverByConvention({
            selectedConventionId: formModel.selectedConventionId,
            currentConventionId: props.meetingId,
        }).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}

onMounted(() => {
    getMeetingDrop().then((res) => {
        MeetingDrop.value = (res.data || []).filter((item: any) => item.value !== props.meetingId)
    })
})
</script>
