<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="80px" label-suffix=":">
                <div class="flex justify-between">
                    <div class="left flex-1">
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model.trim="formModel.userName" placeholder="请输入账号"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model.trim="formModel.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="formModel.sex">
                                <el-radio :value="1">男</el-radio>
                                <el-radio :value="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model.trim="formModel.mobilePhone" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="formModel.position" type="textarea" placeholder="请输入职位" />
                        </el-form-item>
                        <el-form-item label="单位" prop="unitName">
                            <el-input v-model="formModel.unitName" placeholder="请输入单位" :maxlength="20" />
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="formModel.remark" type="textarea" placeholder="请输入备注" />
                        </el-form-item>
                    </div>
                    <div class="w-250px">
                        <el-form-item>
                            <b-upload></b-upload>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div class="flex justify-center mt-20px">
                <el-button type="default" @click="onClose">取消</el-button>
                <el-button type="primary" @click="onConfirm">确定</el-button>
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { addPersonnel, editPersonnel, getPersonnelDetail } from '~/src/api/personnel-manage'

const props = defineProps(['personId'])

const formModel = reactive({
    mobilePhone: '',
    name: '',
    personGroupIDs: 0,
    personID: 0,
    photoURL: '',
    pictureDocumentID: 0,
    position: '',
    remark: '',
    sex: 0,
    unitName: '',
    userName: '',
    file: null,
    tenantId: 0,
})

const formRules = reactive({
    userName: { required: true, message: '请输入账号' },
    name: { required: true, message: '请输入姓名' },
})

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'refresh'])

// function onUploadChange(file) {}

function onClose() {
    emits('close')
}
function onConfirm() {
    refForm.value.validate().then(() => {
        const api = formModel.personID ? editPersonnel : addPersonnel
        // 将formModel转成formData
        const formData = new FormData()
        Object.keys(formModel).forEach((key) => {
            if (key === 'personGroupIDs') return
            formData.append(key, (formModel as any)[key])
        })
        if (Array.isArray(formModel.personGroupIDs)) {
            formModel.personGroupIDs.forEach((id) => {
                formData.append('personGroupIDs', id)
            })
        } else {
            formData.append('personGroupIDs', '0')
        }
        api(formData).then(() => {
            ElMessage.success('操作成功')
            emits('refresh')
            onClose()
        })
    })
}

onMounted(() => {
    if (props.personId) {
        getPersonnelDetail(props.personId).then(({ data }) => {
            Object.assign(formModel, data || {})
        })
    }
})
</script>
