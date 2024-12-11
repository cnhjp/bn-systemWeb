<template>
  <div @click="onTest">你好</div>
</template>

<script setup>
const emits = defineEmits(["test"]);
function onTest() {
  emits("test", 123);
}
</script>
