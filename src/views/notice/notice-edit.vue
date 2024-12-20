<template>
    <notice-form title="编辑" :formData="route.query" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { saveNotice } from '~/src/api/notice'
import noticeForm from './components/notice-form.vue'

const route = useRoute()

function onConfirm(formModel) {
    saveNotice(formModel).then(() => {
        ElMessage.success('操作成功')
    })
}
</script>
