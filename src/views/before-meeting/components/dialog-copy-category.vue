<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="7em" label-suffix=":">
                <el-form-item label="选择会议" prop="tempConventionId">
                    <b-select
                        :data="MeetingDrop"
                        v-model="formModel.tempConventionId"
                        placeholder="请选择会议"
                        @change="onMeetingChange"
                    ></b-select>
                </el-form-item>
                <el-form-item label="会议下分类" prop="categoryIDLIst">
                    <el-checkbox-group v-model="formModel.categoryIDLIst" v-if="formModel.tempConventionId">
                        <el-checkbox v-for="item in CategoryDrop" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                    <div v-else>请先选择会议</div>
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
import { getMeetingDrop } from '~/src/api/meeting-manage'
import { getCategoryList, copyCategory } from '~/src/api/before-meeting/material'

const props = defineProps(['conventionId'])
const emits = defineEmits(['close', 'refresh'])

const formModel = reactive({
    tempConventionId: '',
    conventionID: +props.conventionId,
    categoryIDLIst: [],
})
const formRules = reactive({
    tempConventionId: { required: true, message: '请选择会议' },
    categoryIDLIst: { required: true, message: '请选择分类' },
})

const MeetingDrop = ref([])
onMounted(() => {
    getMeetingDrop().then((res) => {
        MeetingDrop.value = (res.data || []).filter((item) => {
            return item.value !== props.conventionId
        })
    })
})
const CategoryDrop = ref([])
function onMeetingChange(val) {
    getCategoryList({ conventionId: val }).then((res) => {
        CategoryDrop.value = (res.data || [])
            .filter((item) => !item.isDefault)
            .map((item) => {
                return {
                    label: item.name,
                    value: item.categoryID,
                }
            })
    })
}

const refForm = ref<any>(null)

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        copyCategory(formModel).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}
</script>
