<template>
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor
        style="height: 500px; overflow-y: hidden"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        :modelValue="modelValue"
        @update:modelValue="updateContent"
    />
</template>

<script setup lang="ts">
import { IEditorConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

defineProps({
    modelValue: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])

const editorRef = shallowRef(null)

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor
}

const updateContent = (content) => {
    emit('update:modelValue', content) // Emit the new content
}

// 配置
const toolbarConfig = reactive({
    // 隐藏
    excludeKeys: ['emotion', 'group-video', 'insertVideo', 'uploadVideo'],
})
const editorConfig: Partial<IEditorConfig> = {
    MENU_CONF: {
        uploadImage: {
            async customUpload(file: File, insertFn) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.addEventListener('load', () => {
                    insertFn(reader.result)
                })
            },
        },
    },
}

setTimeout(() => {
    console.log(editorRef.value.getConfig())
}, 3000)
</script>
