<template>
    <el-row>
        <el-col :span="20" :offset="2">
            <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="80px">
                <el-form-item label="序号" prop="sortIndex">
                    <el-input v-model="formModel.sortIndex" rule="number" />
                </el-form-item>
                <el-form-item label="酒店名称" prop="hotelId">
                    <el-select v-model="formModel.hotelId">
                        <el-option
                            v-for="item in hotelDropList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="房间类型" prop="roomType">
                    <el-radio-group v-model="formModel.roomType">
                        <el-radio v-for="(type, index) in roomDropList" :key="`roomType${index}`" :value="type.value">
                            {{ type.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="房间号" prop="roomNumber">
                    <el-input v-model="formModel.roomNumber" />
                </el-form-item>
                <el-form-item label="入住人员">
                    <div>
                        <el-button type="primary" plain @click="onSelectPerson">选择人员</el-button>
                        <div class="mt-10px">
                            <el-tag
                                v-for="tag in formModel.personList"
                                :key="tag.personId"
                                closable
                                type="info"
                                @close="onDeletePerson(tag)"
                                class="mr-15px"
                            >
                                {{ tag.personName }}
                            </el-tag>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <div class="el-text--center mt-25px">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm()">确定</el-button>
    </div>
    <b-common-dialog ref="refDialog" @refresh="onRefresh" @confirm="onAssignPerson"></b-common-dialog>
</template>
<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { DropResponse, roomForm } from '@/api/accommodation-manage/types.ts'
import { addRoom, dropDownRoomType, detailRoom, dropDownHotelType } from '@/api/accommodation-manage'
import { dropDownSetValueNumner } from '@/utils'
import DialogSelectPerson from './dialog-select-person.vue'

const props = defineProps(['hotelRoomId', 'isEdit', 'conventionId'])
const emits = defineEmits(['close', 'refresh'])

const formRef = ref<FormInstance>()
const formModel = ref<roomForm>({
    conventionId: 0,
    hotelName: '',
    hotelId: null,
    hotelRoomId: 0,
    roomNumber: '',
    roomType: 1,
    sortIndex: null,
    personList: [],
})
const formRules = reactive<FormRules<roomForm>>({
    sortIndex: [{ required: true, message: '请输入序号', trigger: 'blur' }],
    roomType: [{ required: true, message: '请选择房间类型', trigger: 'blur' }],
})

function onClose() {
    emits('close')
}

function onConfirm() {
    formModel.value.conventionId = props.conventionId
    formRef.value.validate().then((vali) => {
        if (vali) {
            addRoom(formModel.value).then(() => {
                ElMessage.success('操作成功')
                emits('refresh')
                onClose()
            })
        }
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
            conventionId: props.conventionId,
        },
    })
}
function onSelectPerson() {
    const max = formModel.value.roomType === 1 || formModel.value.roomType === 2 ? 1 : 2
    openDialog(DialogSelectPerson, '选择人员', '900px', { maxPerson: max, roomType: formModel.value.roomType })
}

function onAssignPerson(records: any[]) {
    formModel.value.personList = records
}

function onDeletePerson(tag: any) {
    const index = formModel.value.personList.findIndex((it) => it.personId === tag.personId)
    formModel.value.personList.splice(index, 1)
}

// 房间类型下拉
const roomDropList = ref<DropResponse[]>([])
async function dropDownRoom() {
    await dropDownRoomType().then((res) => {
        roomDropList.value = dropDownSetValueNumner(res.data, false, true)
        formModel.value.roomType = res.data[0].value
    })
}

// 酒店下拉
const hotelDropList = ref<DropResponse[]>([])
async function dropDownHotel() {
    dropDownHotelType().then((res) => {
        const { data } = res
        hotelDropList.value = (data || []).map((it) => {
            return {
                label: it.hotelName,
                value: it.id,
            }
        })
    })
}

// 获取EditDetail
async function detailEdit() {
    await detailRoom(props.hotelRoomId).then((res) => {
        formModel.value = res.data
    })
}
async function init() {
    await dropDownRoom()
    await dropDownHotel()
    if (props.isEdit) {
        await detailEdit()
    }
}
init()
</script>

<style scoped lang="scss"></style>
