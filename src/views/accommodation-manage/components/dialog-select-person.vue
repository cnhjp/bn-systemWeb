<template>
    <div class="list-height">
        <person-list ref="personRef" :meetingId="conventionId" is-dialog />
    </div>
    <div class="el-flex is-center mt-10px">
        <el-button @click="onClose">取消</el-button>
        <el-button @click="onConfirm" type="primary">确定</el-button>
    </div>
</template>
<script setup lang="ts">
import PersonList from './person-list.vue'
import { setRoomPerson } from '@/api/accommodation-manage'
import { ElMessage } from 'element-plus'
const props = defineProps(['conventionId', 'hotelRoomId'])
const emits = defineEmits(['close', 'refresh'])
function onClose() {
    emits('close')
}

const personRef = ref<any>(null)
function onConfirm() {
    debugger
    const ids = personRef.value.getSelectPerson()
    if (ids > 2) {
        ElMessage.warning('最多只可以安排2人')
    } else {
        const data = { conventionPersonIdList: ids, hotelRoomId: props.hotelRoomId }
        setRoomPerson(data).then(() => {
            ElMessage.success('操作成功')
        })
    }
}
</script>

<style scoped lang="scss">
.list-height {
    height: 400px;
}
</style>
