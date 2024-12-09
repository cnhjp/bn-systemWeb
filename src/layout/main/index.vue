<template>
  <router-view>
    <template #default="{ Component, route }">
      <keep-alive :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </template>
  </router-view>
</template>

<script setup>
const cacheStore = useCacheStore();
const cacheList = computed(() => cacheStore.cacheList);
</script>
