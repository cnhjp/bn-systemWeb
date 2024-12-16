<template>
    <el-container>
        <el-main>
            <el-form ref="refForm" :model="formModel" :rules="formRules" label-width="80px" label-suffix=":">
                <div class="flex justify-between">
                    <div class="left flex-1">
                        <el-form-item label="账号" prop="userName">
                            {{ formModel.userName }}
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            {{ formModel.sexStr }}
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobilePhone">
                            {{ formModel.mobilePhone }}
                        </el-form-item>
                        <el-form-item label="分组" prop="group">
                            <div v-if="formModel.personGroup && formModel.personGroup.length">
                                <div v-for="item in formModel.personGroup" :key="item">
                                    {{ item }}
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="职位" prop="position">
                            {{ formModel.position }}
                        </el-form-item>
                        <el-form-item label="备注">
                            {{ formModel.remark }}
                        </el-form-item>
                        <el-form-item label="单位" prop="unitName">
                            <el-input v-model="formModel.unitName" placeholder="请输入单位" :maxlength="20" />
                        </el-form-item>
                        <el-form-item label="桌牌" prop="seatingName">
                            <el-input
                                ref="nameInputRef"
                                v-model="formModel.seatingName"
                                placeholder="请输入桌牌"
                                :maxlength="50"
                            />
                        </el-form-item>
                        <el-form-item label="座位号">
                            <el-input v-model="formModel.seatingCode" placeholder="请输入座位号" :maxlength="20" />
                        </el-form-item>
                        <el-form-item label="角色：" prop="conventionRole">
                            <el-radio-group v-model="formModel.conventionRole">
                                <el-radio v-for="item in roleListEdit" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-radio-group v-model="formModel.attendStatus">
                                <el-radio v-for="item in attendStatusList" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div class="w-250px">
                        <el-form-item label-width="40px">
                            <el-image :src="formModel.pictureUrl">
                                <template #error>
                                    <div class="w-210px h-210px bg-gray-100 flex-center">
                                        <el-icon :size="50"><Picture /></el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </el-main>
        <el-footer class="flex-center">
            <el-button type="default" @click="onClose">取消</el-button>
            <el-button type="primary" @click="onConfirm">确定</el-button>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { conventionPersonInfo, updateConventionPerson } from '~/src/api/before-meeting/personnel'
import { getPersonRoleDrop, getPersonAttendStatusDrop } from '~/src/api/common'

const props = defineProps(['conventionPersonId'])

const roleListEdit = ref([])
const attendStatusList = ref([])

const params = { IncludeUnknown: true }
function getRoleList() {
    getPersonRoleDrop(params).then((res) => {
        roleListEdit.value = (res.data || [])
            .filter((item) => !!item.value)
            .map((item) => ({ ...item, value: +item.value }))
    })
}
function getAttendStatusList() {
    getPersonAttendStatusDrop(params).then((res) => {
        attendStatusList.value = (res.data || [])
            .filter((item) => !!item.value && +item.value !== 3)
            .map((item) => {
                return {
                    ...item,
                    value: +item.value,
                }
            })
    })
}

onMounted(() => {
    getRoleList()
    getAttendStatusList()
})

const formModel = reactive<any>({
    conventionRole: '',
    attendStatus: '',
})

const formRules = reactive({
    seatingName: { required: true, message: '请输入桌牌' },
    conventionRole: { required: true, message: '请选择角色' },
})

const refForm = ref<any>(null)
const emits = defineEmits(['close', 'refresh'])

function onClose() {
    emits('close')
}
function onConfirm() {
    refForm.value.validate().then(() => {
        updateConventionPerson(formModel).then(() => {
            ElMessage.success('操作成功')
            onClose()
            emits('refresh')
        })
    })
}

onMounted(() => {
    if (props.conventionPersonId) {
        conventionPersonInfo({ id: props.conventionPersonId }).then((res) => {
            Object.assign(formModel, res.data)
        })
    }
})
</script>
