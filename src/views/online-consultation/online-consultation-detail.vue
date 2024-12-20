<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="详情" is-show-btn />
        </el-header>
        <el-main>
            <div class="el-bg--white p-30px">
                <h1 class="el-text--center is-bold el-text--darkgrey">{{ detail.title }}</h1>
                <div class="el-flex is-center el-text--tips my-15px">
                    <div class="mr-20px">提出人：{{ detail.submitPerson }}</div>
                    <div>提出时间：{{ detail.createTime }}</div>
                </div>
                <div class="mb-15px">{{ detail.content }}</div>
                <h2 class="is-bold el-text--darkgrey py-15px el-border--top">答复内容：</h2>
                <div>
                    <div
                        v-for="(item, index) in detail.replyList"
                        :key="`reply${index}`"
                        class="el-bg--grey p-20px mb-20px"
                    >
                        <div>答复时间：{{ item.replyTime }}</div>
                        <div>{{ item.content }}</div>
                    </div>
                </div>
            </div>
        </el-main>
        <el-footer height="210px" class="el-bg--white">
            <el-form :model="formModel">
                <div class="py-20px">回复后,用户会收到对应短信提醒</div>
                <el-form-item>
                    <el-input v-model="replyContent" type="textarea" :rows="3" />
                </el-form-item>
                <div class="el-flex is-center-end">
                    <el-button type="primary" @click="onReply">回复</el-button>
                </div>
            </el-form>
        </el-footer>
    </el-container>
</template>
<script setup lang="ts">
import { detailOnlineConsultation, replyOnlineConsultation } from '@/api/online-consultation'
import { OnlineConsultationDetail } from '@/api/online-consultation/types.ts'
import { ElMessage } from 'element-plus'

const detail = reactive<OnlineConsultationDetail>({
    id: 0,
    title: '',
    content: '',
    submitPerson: '',
    createTime: '',
    imgList: [],
    replyList: [],
})
const formModel = ref({})
const replyContent = ref<string>('')
function onReply() {
    const data = {
        id: detail.id,
        replyContent: replyContent.value,
    }
    replyOnlineConsultation(data).then(() => {
        ElMessage.success('操作成功')
        init()
    })
}
function init() {
    detailOnlineConsultation().then((res) => {
        Object.assign(detail, res.data)
    })
}
init()
</script>
<style scoped lang="scss"></style>
