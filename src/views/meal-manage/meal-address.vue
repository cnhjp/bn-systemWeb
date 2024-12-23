<template>
    <el-container class="wh-full">
        <el-main>
            <b-grid ref="refGrid" v-bind="gridProps">
                <template #toolbar-left>
                    <el-button type="primary" @click="openAddressDialog('新增地点', false, null)">新增地点</el-button>
                </template>
                <template #toolbar-right>
                    <el-form inline>
                        <el-form-item label="会议名称">
                            <el-select v-model="formModel.conventionGroupId">
                                <el-option
                                    v-for="item in dropMeeting"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="formModel.keyword"
                                placeholder="地址"
                                clearable
                                @keyup.enter="onRefresh"
                                @clear="onRefresh"
                            >
                                <template #append>
                                    <el-button icon="Search" @click="onRefresh" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <template #actions="{ row }">
                    <el-button type="primary" size="small" @click="openAddressDialog('编辑地点', true, row)">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </template>
            </b-grid>
            <b-common-dialog ref="refDialog" @refresh="onRefresh"></b-common-dialog>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import DialogAddressForm from './components/dialog-address-form.vue'
import { getMealAddressPage, deleteMealAddress } from '@/api/meal-manage'
import { useRoute } from 'vue-router'
import { DropResponse } from '@/api/common/types.ts'
import { dropDownConvention } from '@/api/common'

const route = useRoute()

const formModel = ref({
    conventionGroupId: 0,
    keyword: null,
})

const addressList = ref([])

const gridProps = reactive({
    data: [],
    columns: [
        { title: '序号', field: 'sortIndex', minWidth: 80 },
        { title: '用餐地点', field: 'title', minWidth: 220 },
        { title: '操作', slots: { default: 'actions' }, minWidth: 220, fixed: 'right', align: 'center' },
    ],
    pagerConfig: false,
})

const refGrid = ref<any>(null)

function onRefresh() {
    getList()
}

// 弹窗
const refDialog = ref<any>(null)
function openAddressDialog(title, status: boolean, row: any) {
    const query = {
        isEdit: status,
        maxSort: maxSort.value,
        formData: {
            conventionGroupId: formModel.value.conventionGroupId,
            items: addressList.value,
        },
    } as any
    if (row) {
        query.id = row.id
    }
    refDialog.value.openModal({
        component: DialogAddressForm,
        title: title,
        width: '500px',
        params: query,
    })
}

function onDelete(row: any) {
    ElMessageBox.confirm('确定删除该地点吗？').then(() => {
        deleteMealAddress([row.id]).then(() => {
            ElMessage.success('操作成功')
            onRefresh()
        })
    })
}

const dropMeeting = ref<DropResponse[]>([])
const maxSort = ref<number>(1)

async function getList() {
    const query = {
        pageIndex: 1,
        pageSize: 9999,
        isExpro: false,
        ...formModel.value,
    }
    await getMealAddressPage(query).then((res) => {
        gridProps.data = res.data.rows
        maxSort.value = res.data.total + 1
        addressList.value = res.data.rows
    })
}
async function init() {
    const { id } = route.query as any
    await dropDownConvention().then((res) => {
        dropMeeting.value = res.data
        formModel.value.conventionGroupId = dropMeeting.value.length > 0 ? dropMeeting.value[0].value : null
        if (id) {
            formModel.value.conventionGroupId = id
        }
    })
    await getList()
    onRefresh()
}
init()
</script>
