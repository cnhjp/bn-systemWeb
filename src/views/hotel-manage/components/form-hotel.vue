<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="title" is-show-btn />
        </el-header>
        <el-main>
            <el-row class="el-bg--white p-50px">
                <el-col :span="18" :offset="3">
                    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                        <el-form-item label="酒店名称" prop="hotelName">
                            <el-input v-model="formModel.hotelName" />
                        </el-form-item>
                        <el-form-item label="联系方式" prop="hotelContact">
                            <el-input v-model="formModel.hotelContact" />
                        </el-form-item>
                        <el-form-item label="酒店地址" prop="hotelAddress">
                            <el-input v-model="formModel.hotelAddress" />
                        </el-form-item>
                        <el-form-item label="酒店介绍">
                            <el-input type="textarea" :rows="5" v-model="formModel.hotelRemark" />
                        </el-form-item>
                        <el-form-item label="酒店照片">
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
                                        <div>文件大小：10MB</div>
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
                    </el-form>
                    <div class="el-text--center mt-25px">
                        <el-button @click="onClose">取消</el-button>
                        <el-button type="primary" @click="onConfirm()">确定</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { HotelForm } from '@/api/hotel-manage/types.ts'
import { useRouter } from 'vue-router'
import type { UploadFile, FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const emits = defineEmits(['confirm'])

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    formData: {
        type: Object,
        default: () => {},
    },
})

const formRef = ref<FormInstance>()
const formModel = ref<HotelForm>(
    Object.assign(
        {
            hotelID: 0,
            tenantID: 0,
            conventionID: 0,
            hotelName: '',
            hotelAddress: '',
            hotelContact: '',
            hotelRemark: '',
            files: [],
        },
        props.formData,
    ),
)
const formRules = reactive<FormRules<HotelForm>>({
    hotelName: [{ required: true, message: '请输入酒店名称', trigger: 'blur' }],
    hotelContact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
    hotelAddress: [{ required: true, message: '请输入酒店地址', trigger: 'blur' }],
})

// upload
const fileList = ref<any>([])
const imageUrl = ref('')
function onUpload() {
    return Promise.resolve()
}
function onBeforeUpload(rawFile: File) {
    // 检查文件类型和尺寸
    const isJPG = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif'
    const isLt2M = rawFile.size / 1024 < 10 * 1024
    if (!isJPG) {
        ElMessage.error('上传图片格式不正确!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 10MB!')
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
    router.back()
}

function onConfirm() {
    const data = {
        ...formModel.value,
        files: [imageUrl.value],
    }
    formRef.value.validate((valid) => {
        if (valid) {
            emits('confirm', data)
        }
    })
}
</script>
