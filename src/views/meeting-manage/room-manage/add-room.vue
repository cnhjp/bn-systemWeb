<template>
    <room-form title="添加" @confirm="onConfirm" />
</template>
<script setup lang="ts">
import RoomForm from './components/room-form.vue'
import { addMeetingRoom } from '@/api/meeting-manage'

import { useRouter } from 'vue-router'

const router = useRouter()
function onConfirm(form: any) {
    addMeetingRoom(form).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>

<style scoped lang="scss"></style>
