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
                        <el-form-item label-width="40px">
                            <el-upload
                                v-model:file-list="fileList"
                                :http-request="onUpload"
                                :show-file-list="false"
                                :limit="1"
                                :before-upload="onBeforeUpload"
                                :on-success="onUploadSuccess"
                                accept=".png,.jpg,.jpeg,.gif"
                            >
                                <template #tip>
                                    <div class="mt-12px text-12px lh-20px" style="color: #c0c4cc">
                                        <div>文件大小：150KB</div>
                                        <div>文件格式：.jpg, .png, .jpeg, .gif</div>
                                    </div>
                                </template>
                                <div class="w-130px h-130px">
                                    <div class="wh-full relative" v-if="imageUrl">
                                        <div
                                            class="absolute z-20 inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                            @click.stop
                                        >
                                            <el-icon color="#fff" size="16" @click.stop="onDeleteUpload">
                                                <Delete />
                                            </el-icon>
                                        </div>
                                        <el-image :src="imageUrl" fit="cover" class="wh-full rounded relative z-10" />
                                    </div>
                                    <div class="wh-full border-dashed border-2 border-gray-300 flex-center" v-else>
                                        <el-icon size="28"><Plus /></el-icon>
                                    </div>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { addPersonnel, editPersonnel, getPersonnelDetail } from '~/src/api/personnel-manage'
import type { UploadFile } from 'element-plus'

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

// upload
const fileList = ref<any>([])
const imageUrl = ref('')
function onUpload() {
    return Promise.resolve()
}
function onBeforeUpload(rawFile: File) {
    // 检查文件类型和尺寸
    const isJPG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif'
    const isLt2M = rawFile.size / 1024 < 150
    if (!isJPG) {
        ElMessage.error('上传图片格式不正确!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 150KB!')
        return false
    }
    return true
}
function onUploadSuccess(_response: any, file: UploadFile) {
    imageUrl.value = URL.createObjectURL(file.raw!)
}

function onDeleteUpload() {
    imageUrl.value = ''
    fileList.value = []
}

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
        if (fileList.value.length) {
            const file = fileList.value[0]
            formData.append('file', file.raw!)
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
            if (formModel.photoURL) {
                imageUrl.value = formModel.photoURL
                fileList.value = [{ url: formModel.photoURL }]
            }
        })
    }
})
</script>
