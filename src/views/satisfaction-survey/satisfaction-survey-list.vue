<template>
  <el-container class="wh-full">
    <el-main>
      <b-grid ref="refGrid" v-bind="gridProps">
        <template #toolbar-right>
          <el-select v-model="formModel.conventionGroupId" class="meeting-select" @change="onRefresh">
            <el-option
                v-for="item in dropMeeting"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </template>
      </b-grid>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {DropResponse} from '@/api/common/types.ts'
import {dropDownConvention} from '@/api/common'
import {getSatisfactionSurveyPage} from "@/api/satisfaction-survey";


const formModel = ref({
  conventionGroupId: 0,
})

const gridProps = reactive({
  autoLoad: false,
  data: getSatisfactionSurveyPage,
  query: (params: any) => {
    return Object.assign(params, formModel.value)
  },
  columns: [
    {title: '用户', field: 'createPerson', minWidth: 100},
    {title: '大会服务', field: 'meetingService', align: 'center'},
    {title: '酒店服务', field: 'hotelService', align: 'center'},
    {title: '餐饮服务', field: 'mealService', align: 'center'},
    {title: '交通服务', field: 'trafficService', align: 'center'},
    {title: '备注', field: 'remark', minWidth: 200},
  ],
})

const refGrid = ref<any>(null)

function onRefresh() {
  refGrid.value.refresh()
}

const dropMeeting = ref<DropResponse[]>([])

async function init() {
  await dropDownConvention().then((res) => {
    dropMeeting.value = res.data
    formModel.value.conventionGroupId = dropMeeting.value.length > 0 ? dropMeeting.value[0].value : null
  })
  onRefresh()
}

init()
</script>
<style scoped lang="scss">
.meeting-select {
  width: 300px;
}
</style>
