<template>
  <div class="p-20px">
    <el-form :model="formModel" label-width="100px">
      <el-form-item label="会议分组列表">
        <el-select v-model="formModel.conventionGroupId" @change="onRefresh" @clear="onRefresh">
          <el-option
              v-for="item in conventionGroupDropList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会议列表">
        <el-select v-model="formModel.conventionId" @change="onRefresh" @clear="onRefresh"
                   v-if="formModel.conventionGroupId">
          <el-option
              v-for="item in conventionDropList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="el-flex is-center mt-20px">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus'
import {getGroupDrop} from "@/api/before-meeting/info.ts";
import {getMeetingDrop} from "@/api/meeting-manage";
import {publishNotice} from "@/api/notice";

const emits = defineEmits(['close', 'refresh'])

const props = defineProps(['noticeId'])
const formModel = ref<any>({
  conventionGroupId: 1,
  conventionId: 0,
})

function onClose() {
  emits('close')
}

function onConfirm() {
  publishNotice({
    noticeID: props.noticeId,
    conventionGroupID: formModel.value.conventionGroupId,
    conventionID: formModel.value.conventionId,
    isPublish: true,
  }).then(() => {
    ElMessage.success('操作成功')
    emits('refresh')
    emits('close')
  })
}

// 酒店下拉
const conventionGroupDropList = ref<any>([])

async function dropDownHotel() {
  getGroupDrop().then((res) => {
    const {data} = res
    conventionGroupDropList.value = data.map((it: any) => {
      return {
        label: it.label,
        value: it.value,
      }
    })
    formModel.value.conventionGroupId = conventionGroupDropList.value[0].value
    dropConventionDropList()
  })
}

dropDownHotel()

const conventionDropList = ref<any>([])

function dropConventionDropList() {
  getMeetingDrop().then((res) => {
    const {data} = res
    conventionDropList.value = data.map((it: any) => {
      return {
        label: it.label,
        value: it.value,
      }
    })
    formModel.value.conventionId = conventionDropList.value[0].value
  })
}

function onRefresh(value) {
  formModel.value.conventionGroupId = value
}
</script>
