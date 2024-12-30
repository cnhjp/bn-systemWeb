<template>
  <el-container class="wh-full">
    <el-main>
      <b-grid ref="refGrid" v-bind="gridProps">
        <template #toolbar-left>
          <el-button type="primary" @click="onAdd">新增</el-button>
        </template>

        <template #publishTimeStr="{ row }">
          {{ useDateFormat(row.publishTime as string, 'YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template #actions="{ row }">
          <el-button type="primary" size="small" @click="onView(row)">查看</el-button>
          <el-button type="primary" size="small" @click="onPublish(row)">{{ row.isPublish ? '撤回发布' : '发布' }}
          </el-button>
          <el-button type="primary" size="small" @click="onNotice(row)" v-if="row.isPublish">发送通知</el-button>
          <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
        </template>
      </b-grid>
    </el-main>
    <b-common-dialog ref="refDialog" @refresh="onRefresh" @confirm="onPublishConfirm"></b-common-dialog>
  </el-container>
</template>
<script setup lang="ts">
import {useRouteStore} from '~/src/store'
import {getNoticePage, batchDeleteNotice, publishNotice} from '~/src/api/notice'
import {useDateFormat} from "@vueuse/core";
import DialogNoticeSendForm from "@/views/notice/components/dialog-notice-send-form.vue";

const routeStore = useRouteStore()
const router = useRouter()
const refGrid = ref<any>(null)

const gridProps = reactive({
  data: getNoticePage,
  columns: [
    {title: '序号', type: 'seq', width: 80, align: 'center'},
    {title: '标题', field: 'title', minWidth: 180, align: 'center'},
    {title: '发布时间', slots: {default: 'publishTimeStr'}, minWidth: 80, align: 'center'},
    {title: '操作', slots: {default: 'actions'}, minWidth: 220, fixed: 'right', align: 'center'},
  ],
})

function onRefresh() {
  nextTick(() => {
    refGrid.value?.refresh()
  })
}

function onAdd() {
  routeStore.cacheRoutes.push('notice')
  router.push({
    name: 'notice-add',
  })
}

function onEdit(row) {
  routeStore.cacheRoutes.push('notice')
  router.push({
    name: 'notice-edit',
    query: {
      ...row,
    },
  })
}

// 弹窗
const refDialog = ref<any>(null)

function openDialog(component: any, title: string, width: string, params: any) {
  refDialog.value.openModal({
    component: component,
    title: title,
    width: width,
    params: {
      ...params,
    },
  })
}

function onNotice(row) {
  ElMessageBox.confirm('确定发送短信通知吗？').then(() => {
  })
}

onActivated(() => {
  const idx = routeStore.cacheRoutes.indexOf('notice')
  if (idx !== -1) {
    routeStore.cacheRoutes.splice(idx, 1)
  }
  onRefresh()
})

function onDelete(row) {
  ElMessageBox.confirm('确定删除吗？').then(() => {
    batchDeleteNotice([row.id]).then(() => {
      ElMessage.success('操作成功')
      onRefresh()
    })
  })
}

function onView(row) {
  routeStore.cacheRoutes.push('notice')
  router.push({
    name: 'notice-detail',
    query: {
      ...row,
    },
  })
}

function onPublish(row) {
  if (!row.isPublish) {
    openDialog(DialogNoticeSendForm, '发送范围选择', '500px', {noticeId: row.id})
  } else {
    ElMessageBox.confirm('确定撤回发布吗？').then(() => {
      publishNotice({
        noticeID: row.id,
        isPublish: !row.isPublish,
      }).then(() => {
        ElMessage.success('操作成功')
        onRefresh()
      })
    })
  }
}

function onPublishConfirm() {

}
</script>
