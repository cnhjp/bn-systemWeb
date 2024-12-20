<template>
    <notice-form title="添加" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { saveNotice } from '~/src/api/notice'
import noticeForm from './components/notice-form.vue'

function onConfirm(formModel) {
    saveNotice(formModel.value).then(() => {
        ElMessage.success('操作成功')
    })
}
</script>
