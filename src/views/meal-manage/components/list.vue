<template>
  <div class="wh-full">
    <b-grid ref="refGrid" v-bind="gridProps">
      <template #toolbar-left>
        <el-form inline>
          <el-form-item label="用餐地点">
            <el-select v-model="formModel.addressId" @change="onRefresh">
              <el-option
                  v-for="item in dropMealAddress"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用餐日期">
            <el-date-picker
                v-model="formModel.eatDate"
                type="date"
                placeholder="选择日期"
                value-format="x"
                @keyup.enter="onRefresh"
                @change="onRefresh"
            />
          </el-form-item>
          <el-form-item>
            <el-input
                v-model="formModel.keyword"
                placeholder="用餐类型"
                clearable
                @keyup.enter="onRefresh"
                @clear="onRefresh"
            >
              <template #append>
                <el-button icon="Search" @click="onRefresh"/>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #toolbar-right>
        <el-button type="primary" @click="onCreateMeal()">创建用餐</el-button>
        <el-button type="primary" @click="onDelete(null)">批量删除</el-button>
        <el-button type="primary" @click="exportMealList()">导出</el-button>
      </template>
      <template #eatDate="{ row }">
        {{ useDateFormat(row.eatDate, 'YYYY-MM-DD') }}
      </template>
      <template #actions="{ row }">
        <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
      </template>
    </b-grid>
    <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
  </div>
</template>
<script setup lang="ts">
import {useDateFormat} from '@vueuse/core'
import DialogCreateMeal from './dialog-create-meal.vue'
import DialogEditMeal from './dialog-edit-meal.vue'
import {deleteMeals, dropDownMealAddress, exportMeals, getMealPage} from '@/api/meal-manage'
import {dropDownSetValueNumner} from '@/utils'
import {ElMessage} from 'element-plus'

const props = defineProps({
  conventionGroupId: {
    type: Number,
    default: 0,
  },
})

const formModel = ref({
  conventionGroupId: props.conventionGroupId,
  eatDate: '',
  keyword: '',
  addressId: null,
})

const gridProps = reactive({
  data: getMealPage,
  query: (params: any) => {
    return Object.assign(params, formModel.value, {addressId: formModel.value.addressId || 0})
  },
  columns: [
    {type: 'checkbox', width: 80},
    {title: '序号', type: 'seq', width: 80},
    {title: '用餐日期', slots: {default: 'eatDate'}, minWidth: 130},
    {title: '用餐地点', field: 'address', minWidth: 220},
    {title: '用餐类型', field: 'eatName', minWidth: 150},
    {title: '用餐时段', field: 'eatTimeStr', minWidth: 150},
    {title: '已用餐人数', field: 'personCount', minWidth: 150},
    {title: '已用餐次数', field: 'totalTimes', minWidth: 150},
    {title: '操作', slots: {default: 'actions'}, minWidth: 220, fixed: 'right', align: 'center'},
  ],
})

const refGrid = ref<any>(null)

function onRefresh() {
  refGrid.value.refresh()
}

// 弹窗
const refDialog = ref<any>(null)

function openDialog(component: any, title: string, params: any) {
  refDialog.value.openModal({
    component: component,
    title: title,
    width: '800px',
    params: {
      ...params,
      conventionGroupId: props.conventionGroupId,
      addressList: dropMealAddressPop.value,
    },
  })
}

function onCreateMeal() {
  openDialog(DialogCreateMeal, '创建用餐', null)
}

function exportMealList() {
  const selected = refGrid.value.getSelected()
  const ids = selected.map((it: any) => it.id)
  if (ids.length > 0) {
    const query = {
      conventionGroupId: props.conventionGroupId,
      idList: ids,
    }
    exportMeals(query).then(() => {
      ElMessage.success('???')
    })
  } else {
    ElMessage.warning('请先选择需要导出的用餐')
    return
  }
}

function onEdit(row: any) {
  openDialog(DialogEditMeal, '编辑用餐', {row})
}

function onDelete(row: any) {
  let list = []
  if (row) {
    list = [row.id]
  } else {
    const selected = refGrid.value.getSelected()
    const ids = selected.map((it: any) => it.id)
    if (ids.length > 0) {
      list = ids
    } else {
      ElMessage.warning('请先选择需要删除的用餐')
      return
    }
  }
  ElMessageBox.confirm('确定删除该用餐吗？').then(() => {
    deleteMeals(list).then(() => {
      ElMessage.success('操作成功')
      onRefresh()
    })
  })
}

const dropMealAddress = ref<any>([])
const dropMealAddressPop = ref<any>([])

function init() {
  const query = {
    conventionGroupId: props.conventionGroupId,
  }
  dropDownMealAddress(query).then((res) => {
    if (res.data.length > 0) {
      Object.assign(dropMealAddressPop.value, res.data)
      dropMealAddress.value = dropDownSetValueNumner(res.data, true, true)
      formModel.value.addressId = 0
    } else {
      formModel.value.addressId = null
    }
  })
}

init()
</script>
