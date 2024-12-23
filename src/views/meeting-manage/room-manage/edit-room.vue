<template>
    <room-form title="编辑" @confirm="onConfirm" />
</template>
<script setup lang="ts">
import RoomForm from './components/room-form.vue'
import { editMeetingRoom } from '@/api/meeting-manage'

import { useRouter } from 'vue-router'

const router = useRouter()
function onConfirm(form: any) {
    editMeetingRoom(form).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>

<style scoped lang="scss"></style>
