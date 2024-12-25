<template>
    <el-container class="wh-full">
        <el-header>
            <page-header :title="title" is-show-btn />
        </el-header>
        <el-main>
            <el-row class="el-bg--white p-50px">
                <el-col :span="18" :offset="3">
                    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="180px">
                        <el-form-item label="会议室（场地名称）" prop="roomName">
                            <el-input v-model="formModel.roomName" />
                        </el-form-item>
                        <el-form-item label="面积（平方米）" prop="usableArea">
                            <el-input v-model="formModel.usableArea" />
                        </el-form-item>
                        <el-form-item label="容纳人数" prop="galleryful">
                            <el-input v-model="formModel.galleryful" />
                        </el-form-item>
                        <el-form-item label="会议室类型" prop="roomType">
                            <el-select v-model="formModel.roomType">
                                <el-option
                                    v-for="item in roomTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="场地类型" prop="venueType">
                            <el-select v-model="formModel.venueType">
                                <el-option
                                    v-for="item in venueTypeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="formModel.status">
                                <el-option
                                    v-for="item in roomStatusList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="具体地址" prop="address">
                            <el-input v-model="formModel.address" />
                        </el-form-item>
                        <el-form-item label="会场资源">
                            <el-input type="textarea" :rows="5" v-model="formModel.resource" />
                        </el-form-item>
                        <el-form-item label="会议室图片">
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
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { useRouter } from 'vue-router'
import { dropDownMeetingRoomType, dropDownMeetingRoomStatus, dropDownVenueType } from '@/api/meeting-manage'
import { dropDownSetValueNumner } from '@/utils'

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
const formModel = ref<any>(
    Object.assign(
        {
            roomName: '',
            usableArea: '',
            galleryful: '',
            roomType: '',
            venueType: '',
            status: '',
            address: '',
            resource: '',
            file: null,
        },
        props.formData,
    ),
)
const formRules = reactive<FormRules<any>>({
    roomName: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
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
    const data = new FormData()
    const file = fileList.value[0]
    for (const key of Object.keys(formModel.value)) {
        if (key === 'file' && file) {
            data.append(key, file.raw!)
        } else {
            data.append(key, formModel.value[key])
        }
    }
    formRef.value.validate((valid) => {
        if (valid) {
            emits('confirm', data)
        }
    })
}

const roomTypeList = ref([])
const roomStatusList = ref([])
const venueTypeList = ref([])
function init() {
    const { roomType, preview, venueType, status } = formModel.value

    if (preview) {
        fileList.value = [
            {
                url: formModel.value.preview,
            },
        ]
    }
    formModel.value.roomType = roomType || null
    formModel.value.venueType = venueType || null
    formModel.value.status = status || null

    dropDownMeetingRoomType().then((res) => {
        roomTypeList.value = dropDownSetValueNumner(res.data, false, true)
    })
    dropDownMeetingRoomStatus().then((res) => {
        roomStatusList.value = dropDownSetValueNumner(res.data, false, true)
    })
    dropDownVenueType().then((res) => {
        venueTypeList.value = dropDownSetValueNumner(res.data, false, true)
    })
}

init()
</script>

<style scoped lang="scss"></style>
