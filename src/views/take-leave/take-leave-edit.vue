<template>
    <take-leave-form title="编辑" :formData="route.query" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { updateTakeLeave } from '~/src/api/take-leave'
import takeLeaveForm from './components/take-leave-form.vue'

const router = useRouter()
const route = useRoute()

function onConfirm(params) {
    updateTakeLeave(params).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
