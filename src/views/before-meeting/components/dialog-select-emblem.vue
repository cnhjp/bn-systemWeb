<template>
    <el-container>
        <el-main>
            <div>
                <el-image
                    :src="item.picUrl"
                    v-for="item of EmblemDrop"
                    :key="item.picUrl"
                    class="w-110px h-110px mr-10px mb-10px p-10px border-#008Afe cursor-pointer"
                    :class="{
                        border: item.picUrl === selectedPicUrl,
                    }"
                    @click="selectedPicUrl = item.picUrl"
                ></el-image>
            </div>
        </el-main>

        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
const props = defineProps(['EmblemDrop', 'picUrl'])

const emits = defineEmits(['close', 'selectEmblem'])

const selectedPicUrl = ref(props.picUrl || '')

function onClose() {
    emits('close')
}
function onConfirm() {
    const selectedItem = props.EmblemDrop.find((item) => item.picUrl === selectedPicUrl.value)
    emits('selectEmblem', selectedItem)
    onClose()
}
</script>
