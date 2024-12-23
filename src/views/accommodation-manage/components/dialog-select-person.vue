<template>
    <div class="list-height">
        <person-list
            ref="personRef"
            :maxPerson="maxPerson"
            :meetingId="conventionGroupId"
            :roomType="roomType"
            is-dialog
        />
    </div>
    <div class="el-flex is-center mt-10px">
        <el-button @click="onClose">取消</el-button>
        <el-button @click="onConfirm" type="primary">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import PersonList from './person-list.vue'
const props = defineProps(['conventionGroupId', 'hotelRoomId', 'maxPerson', 'roomType'])
const emits = defineEmits(['close', 'confirm'])
function onClose() {
    emits('close')
}

const personRef = ref<any>(null)
function onConfirm() {
    const records = personRef.value.getSelectPerson()
    emits('confirm', records, props.hotelRoomId)
    onClose()
}
</script>

<style scoped lang="scss">
.list-height {
    height: 400px;
}
</style>
