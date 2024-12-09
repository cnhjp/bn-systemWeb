<template>
  列表
  <el-button @click="toDetail">详情</el-button>
</template>

<script setup>
const router = useRouter();

function toDetail() {
  router.push({
    name: "detail",
    params: {
      id: 1,
    },
  });
}

console.log("list created");
</script>
