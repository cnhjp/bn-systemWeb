<template>
    <el-container>
        <el-header class="flex items-center">
            <meetingDropForm v-model="formModel.conventionId" />
            <el-button type="primary" @click="onCategory" class="relative left--20px">分类管理</el-button>
        </el-header>
        <el-main>lll</el-main>
    </el-container>
</template>

<script setup lang="ts">
import meetingDropForm from '../meeting-manage/components/meeting-drop-form.vue'

const router = useRouter()

const formModel = reactive({
    conventionId: '',
})

function onCategory() {
    router.push({
        name: 'before-meeting-material-category',
        query: {
            conventionId: formModel.conventionId,
        },
    })
}
</script>
