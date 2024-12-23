<template>
    <notice-form title="编辑" :formData="route.query" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { saveNotice } from '~/src/api/notice'
import noticeForm from './components/notice-form.vue'

const router = useRouter()
const route = useRoute()

function onConfirm(formModel) {
    saveNotice(formModel.value).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
