<template>
    <h2 class="text-2xl font-bold mb-4">评论列表</h2>
    <ul class="pl-0 space-y-4 list-none">
        <li v-for="comment in commentList" :key="comment.newsCommentID" class="bg-white p-4 rounded-md shadow-md">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                    <img
                        :src="comment.personPhotoUrl"
                        :alt="comment.personName"
                        class="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span class="font-semibold">{{ comment.personName }}</span>
                </div>
                <el-link type="danger" @click="handleDelete(comment.newsCommentID)">删除</el-link>
            </div>
            <p class="text-gray-700 mb-2">{{ comment.comment }}</p>
            <div class="text-gray-500 text-sm">
                {{ comment.publishTime }}
            </div>
        </li>
    </ul>
</template>
<script setup>
import { deleteNewsComment } from '~/src/api/news-manage'

const props = defineProps({
    commentList: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits(['commentDeleted'])

const handleDelete = async (newsCommentID) => {
    try {
        ElMessageBox.confirm('确定删除该评论吗？').then(async () => {
            await deleteNewsComment(newsCommentID)
            ElMessage.success('删除成功')
            emit('commentDeleted', newsCommentID)
        })
    } catch (error) {
        console.error('Failed to delete comment:', error)
        ElMessage.error('删除失败')
    }
}
</script>
