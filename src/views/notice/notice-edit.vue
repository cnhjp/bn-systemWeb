<template>
    <notice-form title="编辑" :id="route.query.id" />
</template>

<script setup lang="ts">
import noticeForm from './components/notice-form.vue'

const route = useRoute()
</script>
