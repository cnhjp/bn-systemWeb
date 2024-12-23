<template>
    <take-leave-form title="编辑" :formData="formData" @confirm="onConfirm" />
</template>

<script setup lang="ts">
import { updateTakeLeave, getTakeLeaveDetail } from '~/src/api/take-leave'
import takeLeaveForm from './components/take-leave-form.vue'

const router = useRouter()
const route = useRoute()


const formData = ref<any>({})

onMounted(() => {
    getTakeLeaveDetail(route.query.id).then((res) => {
        formData.value = res.data
    })
})

function onConfirm(params) {
    updateTakeLeave(params).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
