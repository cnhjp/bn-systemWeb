<template>
    <el-upload ref="uploadRef" v-bind="uploadProps" :before-upload="beforeUpload" :on-error="handleError">
        <slot></slot>

        <slot name="trigger">
            <el-button type="primary" v-if="listType !== 'picture-card' && !drag">
                <el-icon><upload-filled /></el-icon>
                &nbsp;点击上传
            </el-button>
        </slot>

        <slot name="tip" :accept="formattedAccept" :size="formattedSize" v-if="showTip">
            <div class="ml-12px text-12px lh-20px text-coolGray" v-if="listType !== 'picture-card'">
                <div v-if="formattedSize">文件大小：{{ formattedSize }}</div>
                <div v-if="formattedAccept">文件格式：{{ formattedAccept }}</div>
            </div>
        </slot>
    </el-upload>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import type { UploadFile, UploadFiles, UploadRawFile, UploadStatus } from 'element-plus'
import 'element-plus/es/components/upload/style/css'

const props = defineProps({
    size: {
        type: Number,
        default: null, // 默认不限制大小
    },
    tip: {
        type: Boolean,
        default: true,
    },
    accept: {
        type: String,
        default: '', // 默认不限制类型
    },
    // list-type 属性也需要定义在 props 中
    listType: {
        type: String,
        default: 'text',
        validator: (value: string) => ['text', 'picture', 'picture-card'].includes(value),
    },
    drag: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['error'])
const slots = useSlots()

const uploadRef = ref<typeof ElUpload | null>(null)

// 使用 toRefs 将 props 转换为响应式对象
const { listType } = toRefs(props)

// 传给子组件的属性
const attrs = useAttrs()
const uploadProps = computed(() => {
    return {
        ...props,
        listType: listType.value,
        ...attrs,
    } as Partial<(typeof ElUpload)['$props']>
})

// 是否显示tip
const showTip = computed(() => {
    if (slots.tip) {
        return true
    }
    return props.tip
})

// 格式化 Accept 显示
const formattedAccept = computed(() => {
    if (!props.accept) return ''
    return props.accept
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .join(', ')
})

// 格式化 Size 显示
const formattedSize = computed(() => {
    if (!props.size) return ''
    if (props.size < 1024) {
        return props.size + 'KB'
    } else if (props.size < 1024 * 1024) {
        return (props.size / 1024).toFixed(2) + 'MB'
    } else {
        return (props.size / (1024 * 1024)).toFixed(2) + 'GB'
    }
})

// 上传前检查
const beforeUpload = (file: UploadRawFile) => {
    // 1. 检查文件大小
    if (props.size && file.size > props.size * 1024) {
        // Convert KB to bytes
        const errorMsg = `文件大小超出限制 (${formattedSize.value})`
        ElMessage.error(errorMsg)
        emit('error', new Error(errorMsg), file)
        return false // 阻止上传
    }

    // 2. 检查文件类型
    if (props.accept) {
        const fileExtension = '.' + file.name.split('.').pop()!.toLowerCase()
        const acceptedExtensions = props.accept.toLowerCase().split(',')
        if (!acceptedExtensions.includes(fileExtension)) {
            const errorMsg = `文件类型不正确，应为 ${formattedAccept.value}`
            ElMessage.error(errorMsg)
            emit('error', new Error(errorMsg), file)
            return false // 阻止上传
        }
    }

    return true // 允许上传
}

// 处理 el-upload 的 error 事件
const handleError = (err: Error, file: UploadFile, fileList: UploadFiles) => {
    emit('error', err, file, fileList)
}

// 暴露 el-upload 的方法
defineExpose({
    clearFiles: (status?: UploadStatus[]) => uploadRef.value!.clearFiles(status),
    abort: (file: UploadFile) => uploadRef.value!.abort(file),
    submit: () => uploadRef.value!.submit(),
    handleStart: (file: UploadRawFile) => uploadRef.value!.handleStart(file),
    handleRemove: (file: UploadRawFile) => uploadRef.value!.handleRemove(file),
})
</script>
