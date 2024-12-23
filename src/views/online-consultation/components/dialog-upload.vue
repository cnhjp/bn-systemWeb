<template>
    <b-upload
        v-model:file-list="list"
        :auto-upload="false"
        :limit="9"
        :before-upload="onBeforeUpload"
        :on-change="onFileChange"
        accept=".png,.jpg,.jpeg,.gif,.doc,.docx,.pdf,.doc,.docx,.wps,.xls,.xlsx,.ppt,.pptx"
        :size="10 * 1024"
        multiple
    />
    <div class="el-text--center mt-25px">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm()">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import { UploadFile } from 'element-plus'
const emits = defineEmits(['close', 'confirm'])

const props = defineProps({
    fileList: {
        type: Array,
        default: () => [],
    },
})

const list = ref([])
function onFileChange(_response: any, file: UploadFile) {
    list.value = file
}

function onClose() {
    emits('close')
}

function onConfirm() {
    emits('confirm', list.value)
    onClose()
}

function init() {
    list.value = props.fileList
}
</script>

<style scoped lang="scss"></style>
