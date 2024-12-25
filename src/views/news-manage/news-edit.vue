<template>
    <news-form title="添加" @confirm="onConfirm" :data="data"></news-form>
</template>

<script setup lang="ts">
import newsForm from './components/news-form.vue'
import { editNews, getNewsDetail } from '~/src/api/news-manage'

const route = useRoute()
const router = useRouter()

const data = ref<any>({})

onMounted(() => {
    getNewsDetail(route.query.id).then((res) => {
        data.value = res.data || {}
    })
})

function onConfirm(data: any) {
    editNews(data).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
