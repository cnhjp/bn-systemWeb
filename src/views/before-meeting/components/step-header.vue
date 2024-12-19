<template>
    <el-steps :active="active - 1" finish-status="success" process-status="finish" class="w-full pt-10px" v-if="active">
        <el-step title="会议信息"></el-step>
        <el-step title="会议人员"></el-step>
        <el-step title="会议材料"></el-step>
        <el-step title="保存提交"></el-step>
    </el-steps>
</template>

<script setup lang="ts">
const route = useRoute()

const active = computed(() => {
    return +route.query.step
})
</script>
