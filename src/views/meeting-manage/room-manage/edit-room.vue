<template>
    <room-form :form-data="formDate" title="编辑" @confirm="onConfirm" v-if="visible" />
</template>
<script setup lang="ts">
import RoomForm from './components/room-form.vue'
import { detailMeetingRoom, editMeetingRoom } from '@/api/meeting-manage'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
function onConfirm(form: any) {
    editMeetingRoom(form).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}

const visible = ref<boolean>(false)
const formDate = ref<any>(null)
function init() {
    const id = route.query?.id as string
    detailMeetingRoom(id).then((res) => {
        formDate.value = res.data
        visible.value = true
    })
}
init()
</script>

<style scoped lang="scss"></style>
