<template>
    <el-container class="wh-full">
        <el-header>
            <page-header title="详情" is-show-btn />
        </el-header>
        <el-main>
            <div class="el-bg--white p-30px">
                <h1 class="el-text--center is-bold el-text--darkgrey">{{ detail.title }}</h1>
                <div class="el-flex my-15px el-round is-mini info">
                    <div class="mr-20px">
                        <div class="el-text--center el-text--default">提出人</div>
                        {{ detail.createBy }}
                    </div>
                    <div>
                        <div class="el-text--center el-text--default">提出时间</div>
                        {{ DateUtil.formatDate(detail.createTime, 'yyyy-MM-dd HH:mm') }}
                    </div>
                </div>
                <h2 class="is-bold el-text--darkgrey my-20px">意见内容</h2>
                <div class="el-bg--grey px-16px py-20px el-round">{{ detail.content }}</div>
                <h2 class="is-bold el-text--darkgrey my-20px">答复内容</h2>
                <div class="reply-wrapper px-20px">
                    <div
                        v-for="(item, index) in detail.messages"
                        :key="`reply${index}`"
                        class="reply pb-20px mb-20px el-border--bottom is-dashed"
                    >
                        <div class="el-text--tips time el-flex is-center-between">
                            <div class="el-flex is-center">
                                答复时间 {{ DateUtil.formatDate(item.createTime, 'yyyy-MM-dd HH:mm') }}
                            </div>
                            <el-link type="danger">
                                <el-icon class="el-icon--left"><DeleteFilled /></el-icon>
                                删除
                            </el-link>
                        </div>
                        <div>{{ item.content }}</div>
                    </div>
                </div>
                <el-form :model="formModel">
                    <div class="py-20px el-text--tips">回复后,用户会收到对应短信提醒</div>
                    <el-form-item>
                        <el-input v-model="formModel.content" type="textarea" :rows="3" />
                    </el-form-item>
                    <div class="files">
                        <div
                            v-for="(item, index) in formModel.files"
                            :key="`files${index}`"
                            class="el-flex is-center-between el-bg--grey my-10px p-10px"
                        >
                            <div>
                                {{ item.name }}
                            </div>
                            <el-icon class="el-text--danger" @click="onDeleteFileItem(index)">
                                <Delete />
                            </el-icon>
                        </div>
                    </div>
                    <div class="el-flex is-center-between">
                        <el-link type="primary" @click="openDialog">
                            <el-icon class="el-icon--left"><UploadFilled /></el-icon>
                            上传附件
                        </el-link>
                        <el-button type="primary" @click="onReply">回复</el-button>
                    </div>
                </el-form>
            </div>
        </el-main>
        <b-common-dialog ref="refDialog" @confirm="getFiles"></b-common-dialog>
    </el-container>
</template>
<script setup lang="ts">
import { detailOnlineConsultation, replyOnlineConsultation } from '@/api/online-consultation'
import { OnlineConsultationDetail } from '@/api/online-consultation/types.ts'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { DateUtil } from '../../utils/date-util.ts'
import DialogUpload from './components/dialog-upload.vue'

const route = useRoute()
const detail = reactive<OnlineConsultationDetail>({
    id: 0,
    title: '',
    content: '',
    createBy: '',
    createTime: '',
    documents: [],
    messages: [],
})
const formModel = ref({
    id: 0,
    content: '',
    files: [],
})
function onReply() {
    if (!formModel.value.content) {
        ElMessage.warning('请输入回复内容')
        return
    }
    const files = []
    formModel.value.files.forEach((it) => {
        files.push(it.raw)
    })
    formModel.value.files = files
    const data = new FormData()
    for (const key of Object.keys(formModel.value)) {
        data.append(key, formModel.value[key])
    }
    replyOnlineConsultation(data).then(() => {
        ElMessage.success('操作成功')
        init()
    })
}

// 弹窗
const refDialog = ref<any>(null)
function openDialog() {
    refDialog.value.openModal({
        component: DialogUpload,
        title: '上传附件',
        width: '600px',
    })
}

function getFiles(list) {
    formModel.value.files = list
}

function onDeleteFileItem(index) {
    formModel.value.files.splice(index, 1)
}

function init() {
    const { id } = route.query
    formModel.value.id = id
    formModel.value.content = ''
    formModel.value.files = []
    detailOnlineConsultation({ id }).then((res) => {
        Object.assign(detail, res.data)
    })
}
init()
</script>
<style scoped lang="scss">
.info {
    background: rgba(0, 138, 254, 0.05);
    border-radius: 4px 0px 0px 4px;
    border: 1px solid #d3ebff;
    > div {
        display: flex;
        align-items: center;
        flex: 1;
        height: 50px;
        &:first-child {
            border-right: 1px solid #d3ebff;
        }
        > div {
            width: 119px;
            margin-right: 20px;
            border-right: 1px solid #d3ebff;
            line-height: 1;
        }
    }
}
h2 {
    display: flex;
    align-items: center;
    &:before {
        content: '';
        display: block;
        width: 6px;
        height: 18px;
        margin-right: 10px;
        border-radius: 6px;
        background: var(--el-color-primary);
    }
}
.reply-wrapper {
    .reply {
        .time {
            font-size: 14px;
            > div {
                &:before {
                    content: '';
                    display: block;
                    width: 5px;
                    height: 5px;
                    margin-right: 5px;
                    border-radius: 5px;
                    background: var(--el-color-primary);
                }
            }
        }
    }
}
i {
    cursor: pointer;
}
</style>
