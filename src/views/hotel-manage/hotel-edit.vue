<template>
    <form-hotel :formData="formModel" title="编辑" @comform="onConfirm" v-if="visible" />
</template>
<script setup lang="ts">
import FormHotel from './components/form-hotel.vue'
import { editHotel, detailHotel } from '@/api/hotel-manage'
import { HotelForm } from '@/api/hotel-manage/types.ts'
import { useRoute } from 'vue-router'

const route = useRoute()
const visible = ref<boolean>(false)
const formModel = ref<HotelForm>({
    id: 0,
    name: '',
    contact: null,
    address: '',
    introduction: '',
    docName: '',
    docId: 0,
    docPath: '',
})

function onConfirm(form: HotelForm) {
    editHotel(form).then(() => {
        ElMessage.success('操作成功')
    })
}
function init() {
    const id = route.query?.id as string
    detailHotel(id).then((res) => {
        formModel.value = res.data
        visible.value = true
    })
}
init()
</script>

<style scoped lang="scss"></style>
