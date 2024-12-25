<template>
  <el-row>
    <el-col :span="20" :offset="2">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
        <el-form-item label="序号" prop="sortIndex">
          <el-input v-model="formModel.sortIndex"></el-input>
        </el-form-item>
        <el-form-item label="酒店">
          <el-select v-model="formModel.hotelID" placeholder="会议角色" @change="onRefresh" @clear="onRefresh">
            <el-option
                v-for="item in hotelDropList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="餐厅名称" prop="title">
          <el-input v-model="formModel.title"></el-input>
        </el-form-item>
        <el-form-item label="餐厅地址" prop="address">
          <el-input v-model="formModel.address"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数" prop="maxPersonCount">
          <el-input v-model="formModel.maxPersonCount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formModel.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
  <div class="el-text--center mt-25px">
    <el-button @click="onClose">取消</el-button>
    <el-button type="primary" @click="onConfirm()">确定</el-button>
  </div>
</template>
<script setup lang="ts">
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {addMealAddress} from '@/api/meal-manage'
import {dropDownHotelType} from "@/api/accommodation-manage";

const emits = defineEmits(['close', 'refresh'])

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    default: 1,
  },
  maxSort: {
    type: Number,
    default: 1,
  },
  formData: {
    type: Object,
    default: () => {
    },
  },
})

const formRef = ref<FormInstance>()
const formModel = ref({
  id: 0,
  sortIndex: 1,
  title: '',
  maxPersonCount: 0,
  address: '',
  remark: '',
  hotelID: 0,
})
const formRules = reactive<FormRules>({
  sortIndex: [{required: true, message: '请输入序号', trigger: 'blur'}],
  title: [{required: true, message: '请输入地址', trigger: 'blur'}],
})

function onClose() {
  emits('close')
}

function onConfirm() {
  formRef.value.validate().then((vali) => {
    if (vali) {
      const data = {} as any
      Object.assign(data, props.formData)
      if (!formModel.value.id) {
        data.items.push(formModel.value)
      } else {
        data.items.map((it: any) => {
          if (it.id == props.id) {
            it = formModel.value
          }
          return it
        })
      }
      addMealAddress(data).then(() => {
        ElMessage.success('操作成功')
        emits('refresh')
        onClose()
      })
    }
  })
}

function init() {
  dropDownHotel()
  if (props.isEdit) {
    formModel.value = props.formData.items.find((it) => it.id == props.id)
  } else {
    formModel.value.sortIndex = props.maxSort
  }
}

// 酒店下拉
const hotelDropList = ref<any>([])

async function dropDownHotel() {
  dropDownHotelType().then((res) => {
    const {data} = res
    hotelDropList.value = data.map((it: any) => {
      return {
        label: it.hotelName,
        value: it.id,
      }
    })
    formModel.value.hotelID = hotelDropList.value[0].value
  })
}

init()
</script>

<style scoped lang="scss"></style>
