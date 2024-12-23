<template>
    <take-leave-form title="添加" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { addTakeLeave } from '~/src/api/take-leave'
import takeLeaveForm from './components/take-leave-form.vue'

const router = useRouter()

function onConfirm(params) {
    addTakeLeave(params).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
