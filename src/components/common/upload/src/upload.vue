<template>
    <el-upload
        ref="uploadRef"
        :before-upload="beforeUpload"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :http-request="httpRequest ? customHttpRequest : undefined"
        v-bind="uploadProps"
    >
        <slot></slot>

        <slot name="trigger">
            <el-button type="primary" v-if="showDefaultTrigger">
                <el-icon><upload-filled /></el-icon>
                 点击上传
            </el-button>
        </slot>

        <slot name="tip" :accept="formattedAccept" :size="formattedSize" v-if="showTip">
            <div class="ml-12px text-12px lh-20px text-coolGray" v-if="listType !== 'picture-card'">
                <div v-if="formattedSize">文件大小：{{ formattedSize }}</div>
                <div v-if="formattedAccept">文件格式：{{ formattedAccept }}</div>
            </div>
        </slot>
        <!-- 进度条 -->
        <template #file="{ file }">
            <slot name="file" :file="file">
                <div class="el-upload-list__item" :class="`is-${file.status}`">
                    <el-image
                        v-if="file.status !== 'uploading' && file.url && isImage(file)"
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        :alt="file.name"
                        fit="cover"
                    />
                    <span class="el-upload-list__item-file">
                        <i class="el-icon-document"></i>
                        <span class="el-upload-list__item-name">{{ file.name }}</span>
                    </span>
                    <span v-if="file.status === 'uploading'" class="el-upload-list__item-status-label">
                        <el-progress
                            :percentage="file.percentage"
                            :status="file.percentage === 100 ? 'success' : undefined"
                        />
                    </span>
                    <label class="el-upload-list__item-status-label">
                        <i
                            :class="[
                                'el-icon-' + getFileStatusIcon(file),
                                file.status === 'success' ? 'el-icon-circle-check' : '',
                            ]"
                        ></i>
                        <span v-if="file.status === 'success'">上传成功</span>
                        <span v-else-if="file.status === 'fail'">上传失败</span>
                    </label>
                    <span class="el-upload-list__item-actions">
                        <i class="el-icon-view" @click="handlePreview(file)"></i>
                        <i class="el-icon-delete" @click="handleRemove(file)"></i>
                    </span>
                </div>
            </slot>
        </template>
    </el-upload>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElUpload, ElLoading } from 'element-plus'
import type {
    UploadFile,
    UploadFiles,
    UploadRawFile,
    UploadStatus,
    UploadRequestOptions,
    UploadProgressEvent,
} from 'element-plus'
import type { UploadAjaxError } from 'element-plus/lib/components/upload/src/ajax.js'
import type { Awaitable } from 'element-plus/es/utils'
import 'element-plus/es/components/upload/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/progress/style/css'
import 'element-plus/es/components/image/style/css'

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
    listType: {
        type: String,
        default: 'text',
        validator: (value: string) => ['text', 'picture', 'picture-card'].includes(value),
    },
    drag: {
        type: Boolean,
        default: false,
    },
    httpRequest: {
        type: Function as PropType<(options: UploadRequestOptions) => XMLHttpRequest | Promise<unknown>>,
        default: null,
    },
    beforeUpload: {
        type: Function as PropType<
            (rawFile: UploadRawFile) => Awaitable<void | undefined | null | boolean | File | Blob>
        >,
        default: null,
    },
    onError: {
        type: Function as PropType<(error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
        default: null,
    },
    onProgress: {
        type: Function as PropType<
            (evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void
        >,
        default: null,
    },
    onSuccess: {
        type: Function as PropType<(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => void>,
        default: null,
    },
})

const emit = defineEmits(['error', 'success', 'all-complete'])
const slots = useSlots()

const uploadRef = ref<typeof ElUpload | null>(null)
const loadingInstance = ref<any>(null) // Loading 实例
const uploadingFiles = ref<UploadRawFile[]>([]) // 正在上传的文件列表

// 传给子组件的属性
const attrs = useAttrs()
const uploadProps = computed(() => {
    // props中的部分属性不传递
    const propsToOmit = ['beforeUpload', 'onError', 'onProgress', 'onSuccess', 'httpRequest']
    const OmittedProps = Object.keys(props)
        .filter((key) => !propsToOmit.includes(key))
        .reduce((acc: any, key: string) => {
            acc[key] = props[key as keyof typeof props]
            return acc
        }, {})
    return {
        ...OmittedProps,
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

// 是否显示默认上传触发按钮
const showDefaultTrigger = computed(() => {
    return props.listType !== 'picture-card' && !props.drag
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
const beforeUpload = async (file: UploadRawFile) => {
    // 若props.beforeUpload执行返回false或者返回 Promise 且被 reject，则停止上传
    if (props.beforeUpload) {
        const result = props.beforeUpload(file)
        if (result === false) {
            return false
        }
        if (result instanceof Promise) {
            await result
        }
    }

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
            return false
        }
    }

    // 将文件添加到正在上传的文件列表
    uploadingFiles.value.push(file)

    // 如果传入了 httpRequest 且当前只有一个文件开始上传，则显示 Loading
    if (props.httpRequest! && uploadingFiles.value.length === 1) {
        nextTick(() => {
            loadingInstance.value = ElLoading.service({
                target: uploadRef.value?.$el,
                text: '上传中...',
            })
        })
    }

    return true // 允许上传
}

// 处理 el-upload 的 error 事件
const handleError = (err: Error, file: UploadFile, fileList: UploadFiles) => {
    props.onError?.(err, file, fileList)
    emit('error', err, file, fileList)
    // checkAndCloseLoading(file.raw!)
}

// 自定义上传方法
const customHttpRequest = async (options: UploadRequestOptions) => {
    if (props.httpRequest) {
        try {
            const res = await props.httpRequest(options)
            // 上传成功
            options.onSuccess(res)
            emit('success', res, options.file)
        } catch (err) {
            // 上传失败
            options.onError(err as UploadAjaxError)
        } finally {
            checkAndCloseLoading(options.file)
        }
    }
}

// 处理上传进度
const handleProgress = (event: UploadProgressEvent, file: UploadFile, fileList: UploadFiles) => {
    props.onProgress?.(event, file, fileList)
    file.status = 'uploading'
    file.percentage = Math.floor(event.percent)
}

// 处理上传成功
const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
    props.onSuccess?.(response, file, fileList)
    file.status = 'success'
    file.percentage = 100
    emit('success', response, file)
    // checkAndCloseLoading(file.raw!)
}

// 检查是否所有文件都上传完毕，如果是，则关闭 Loading 并触发 all-complete 事件
const checkAndCloseLoading = (file: UploadRawFile) => {
    // 从正在上传的文件列表中移除当前文件
    uploadingFiles.value = uploadingFiles.value.filter((f) => f.uid !== file.uid)
    // 如果所有文件都上传完毕，则关闭 Loading
    if (uploadingFiles.value.length === 0) {
        if (loadingInstance.value) {
            loadingInstance.value.close()
        }
        emit('all-complete') // 所有文件上传完毕（无论成功还是失败）
    }
}

// 判断是否为图片
const isImage = (file: UploadFile) => {
    return /^image\//.test(file.raw!.type)
}

// 获取文件状态图标
const getFileStatusIcon = (file: UploadFile) => {
    if (file.status === 'success') {
        return 'circle-check'
    } else if (file.status === 'fail') {
        return 'circle-close'
    } else {
        return 'document'
    }
}

// 预览文件
const handlePreview = (file: UploadFile) => {
    // 实现预览逻辑
    console.log('预览文件:', file)
}

// 移除文件
const handleRemove = (file: UploadFile) => {
    // 实现移除逻辑
    console.log('移除文件:', file)
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
