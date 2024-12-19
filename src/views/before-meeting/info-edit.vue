<template>
    <info-form :id="route.query.id" />
</template>

<script setup lang="ts">
import infoForm from './components/info-form.vue'

const route = useRoute()
</script>
