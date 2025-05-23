<template>
  <el-container class="wh-full">
    <el-main>
      <b-grid ref="refGrid" v-bind="gridProps">
        <template #toolbar-left>
          <el-button type="primary" size="" @click="onAdd()">添加</el-button>
        </template>

        <template #photo="{ row }">
          <el-image :src="row.preview" class="preview-img"
                    fit="cover"
                    :preview-src-list="[row.preview]"
                    :initial-index="0">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <icon-picture/>
                </el-icon>
              </div>
            </template>
          </el-image>
        </template>


        <template #toolbar-right>
          <el-input
              v-model="formModel.keyword"
              placeholder="会议室名称"
              clearable
              @keyup.enter="onRefresh"
              @clear="onRefresh"
          >
            <template #append>
              <el-button icon="Search" @click="onRefresh"/>
            </template>
          </el-input>
        </template>

        <template #actions="{ row }">
          <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
        </template>
      </b-grid>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {deleteMeetingRoom, getMeetingRoomPage} from '@/api/meeting-manage'
import {Picture as IconPicture} from '@element-plus/icons-vue'

const router = useRouter()
const formModel = ref({
  tenantID: 0,
  keyword: null,
  iExpro: false,
})

const gridProps = reactive({
  data: getMeetingRoomPage,
  query: (params: any) => {
    return Object.assign(params, formModel.value)
  },
  columns: [
    {title: '会议室名称', field: 'roomName', minWidth: 220},
    {title: '面积', field: 'usableArea', minWidth: 120},
    {title: '图片', slots: {default: 'photo'}, minWidth: 220},
    {title: '容纳人数', field: 'galleryful', minWidth: 120},
    {title: '会议室类型', field: 'roomTypeStr', minWidth: 120},
    {title: '场地类型', field: 'venueTypeStr', minWidth: 120},
    {title: '状态', field: 'statusStr', minWidth: 120},
    {title: '具体地址', field: 'address', minWidth: 120},
    {title: '操作', slots: {default: 'actions'}, minWidth: 220, fixed: 'right', align: 'center'},
  ],
})

const refGrid = ref<any>(null)

function onRefresh() {
  refGrid.value.refresh()
}

function onAdd() {
  router.push({name: 'room-manage-add'})
}

function onEdit(row: any) {
  router.push({name: 'room-manage-edit', query: {id: row.id}})
}

function onDelete(row: any) {
  ElMessageBox.confirm('确定删除该会议室吗？').then(() => {
    deleteMeetingRoom(row.id).then(() => {
      ElMessage.success('操作成功')
      onRefresh()
    })
  })
}
</script>

<style scoped>
.preview-img {
  width: 100px;
  height: 100px;
}
</style>
