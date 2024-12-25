<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="详情" is-show-btn></page-header>
        </el-header>
        <el-main class="bg-white">
            <div class="el-bg--white p-50px">
                <div class="text-center font-bold text-20px">{{ data.title }}</div>
                <div class="text-right text-14px color-#666">
                    {{ (data.publishTime || ('' as string)).replace('T', ' ') }}
                </div>
                <div class="mt-30px" v-html="data.content"></div>

                <comment-list
                    :commentList="[
                        {
                            commentID: '1',
                            personPhotoUrl: 'https://via.placeholder.com/40',
                            personName: 'John Doe',
                            comment: 'Great article!',
                            publishTime: '2023-10-27 10:00:00',
                        },
                        {
                            commentID: '2',
                            personPhotoUrl: 'https://via.placeholder.com/40',
                            personName: 'Jane Smith',
                            comment: 'Very helpful content.',
                            publishTime: '2023-10-27 11:00:00',
                        },
                    ]"
                    @commentDeleted="getDetail"
                />
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { getNewsDetail } from '~/src/api/news-manage'
import commentList from './components/comment-list.vue'

const route = useRoute()

const data = ref<any>({})
function getDetail() {
    getNewsDetail(route.query.id).then((res) => {
        data.value = res.data || {}
    })
}

onMounted(() => {
    getDetail()
})
</script>
