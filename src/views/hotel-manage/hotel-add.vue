<template>
    <form-hotel title="添加" @confirm="onConfirm" />
</template>
<script setup lang="ts">
import FormHotel from './components/form-hotel.vue'
import { addHotel } from '@/api/hotel-manage'
import { HotelForm } from '@/api/hotel-manage/types.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

function onConfirm(form: HotelForm) {
    addHotel(form).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>

<style scoped lang="scss"></style>
