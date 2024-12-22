<template>
    <form-hotel :formData="formModel" title="编辑" @confirm="onConfirm" v-if="visible" />
</template>
<script setup lang="ts">
import FormHotel from './components/form-hotel.vue'
import { editHotel, detailHotel } from '@/api/hotel-manage'
import { HotelForm } from '@/api/hotel-manage/types.ts'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const visible = ref<boolean>(false)
const formModel = ref<HotelForm>({
    hotelID: 0,
    tenantID: 0,
    conventionID: 0,
    hotelName: '',
    hotelAddress: '',
    hotelContact: '',
    hotelRemark: '',
    files: [],
})

const router = useRouter()

function onConfirm(form: HotelForm) {
    editHotel(form).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
function init() {
    const id = route.query?.id as string
    detailHotel(id).then((res) => {
        const { data } = res!
        formModel.value = {
            hotelID: data.id,
            tenantID: 0,
            conventionID: 0,
            hotelName: data.hotelName,
            hotelAddress: data.hotelAddress,
            hotelContact: data.hotelContact,
            hotelRemark: data.hotelRemark,
            files: data.hotelPhotos,
        }
        visible.value = true
    })
}
init()
</script>

<style scoped lang="scss"></style>
