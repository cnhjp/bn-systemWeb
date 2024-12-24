<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="90px" label-suffix=":">
                <el-form-item label="班次" prop="title">
                    <el-input v-model="formModel.title" placeholder="请输入班次" maxlength="20" />
                </el-form-item>
                <el-form-item label="发车时间" prop="startTime">
                    <el-date-picker
                        type="datetime"
                        v-model="formModel.startTime"
                        placeholder="选择发车时间"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DDTHH:mm"
                        class="!w-full"
                    />
                </el-form-item>
                <el-form-item label="发车地" prop="startAddress">
                    <el-input v-model="formModel.startAddress" placeholder="请输入发车地" maxlength="20" />
                </el-form-item>
                <el-form-item label="路线" prop="regularServiceRoute">
                    <el-input v-model="formModel.regularServiceRoute" placeholder="请输入路线" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model="formModel.remark"
                        type="textarea"
                        :rows="3"
                        maxlength="200"
                        placeholder="请输入备注"
                        show-word-limit
                    />
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
import { saveBus } from '~/src/api/bus-manage'

const props = defineProps({
    row: {
        type: Object,
        default: () => ({}),
    },
})

const formModel = reactive(
    Object.assign(
        {
            title: '',
            startTime: '',
            startAddress: '',
            remark: '',
            regularServiceRoute: '',
        },
        props.row,
    ),
)

const formRules = reactive({
    title: { required: true, message: '请输入班次' },
    startTime: { required: true, message: '请选择发车时间' },
    startAddress: { required: true, message: '请输入发车地' },
})

const refForm = ref<any>(null)

const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}

function onConfirm() {
    refForm.value.validate().then(() => {
        saveBus(formModel).then(() => {
            ElMessage.success('操作成功')
            onClose()
            emits('refresh')
        })
    })
}
</script>
