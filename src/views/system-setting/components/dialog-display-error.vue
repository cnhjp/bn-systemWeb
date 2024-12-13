<template>
    <el-container>
        <el-main class="!p-0">
            <div class="flex items-center">
                <el-icon class="mr-10px"><InfoFilled /></el-icon>
                <el-link type="success" :underline="false">新增{{ info.addCount }}条数据</el-link>
                ，
                <el-link type="danger" :underline="false">失败{{ info.errorPersonList.length }}条数据</el-link>
                ，
                <el-link type="warning" :underline="false">更新{{ info.updateCountz }}条数据</el-link>
                ，
                <el-link type="info" :underline="false">跳过{{ info.skipPersonList.length }}条数据</el-link>
            </div>

            <div class="mt-20px" v-if="info.errorPersonList.length">
                <div class="font-bold">失败原因:</div>
                <div v-for="(error, index) in info.errorPersonList" :key="index">
                    第{{ error.lineNum }}行，{{ error.errorTips }}
                </div>
            </div>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="primary" @click="onClose">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
defineProps({
    info: {
        type: Object,
        default: () => ({}),
    },
})

const emits = defineEmits(['close'])

function onClose() {
    emits('close')
}
</script>
