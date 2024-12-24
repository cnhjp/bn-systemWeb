<template>
    <news-form title="添加" @confirm="onConfirm"></news-form>
</template>

<script setup lang="ts">
import newsForm from './components/news-form.vue'
import { addNews } from '~/src/api/news-manage'

const router = useRouter()

function onConfirm(data: any) {
    addNews(data).then(() => {
        ElMessage.success('操作成功')
        router.back()
    })
}
</script>
