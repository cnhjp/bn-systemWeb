<template>
    <el-container class="h-full">
        <el-main>
            <div class="layout-page">
                <div class="layout-top">
                    <div>
                        <span class="layout-name">{{ layoutName }}</span>
                        <i class="el-icon-edit" style="cursor: pointer" @click="handleEditName" />
                        <span v-if="saveTime" class="save-time">{{ saveTime | formatDate }} 自动保存</span>
                    </div>
                    <div>
                        <el-button type="primary" size="small" @click="goBack">退出</el-button>
                    </div>
                </div>
                <div class="layout-wrapper">
                    <seat-main
                        ref="seat"
                        :seatlayout-id="$route.query.id"
                        :convention-id="$route.query.conventionId"
                        @getName="getName"
                        @saveTime="getTime"
                    />
                </div>
                <el-dialog title="修改名称" v-model="dialogVisible" width="30%">
                    <el-form ref="ruleForm" :model="form">
                        <el-form-item
                            label="名称"
                            label-width="80px"
                            prop="editLayoutName"
                            :rules="[{ required: true, message: '请输入名称', trigger: 'change' }]"
                        >
                            <el-input v-model="form.editLayoutName" autocomplete="off" maxlength="50" />
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submit">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import seatMain from './components/seat-main.vue'
import { updateSeatLayout } from '@/api/seat'
export default {
    components: {
        seatMain,
    },
    data() {
        return {
            dialogVisible: false,
            isFullScreen: false,
            layoutName: '',
            saveTime: '',
            form: {
                editLayoutName: '',
            },
        }
    },
    methods: {
        getName(name) {
            this.layoutName = name
        },
        getTime(time) {
            this.saveTime = time
        },
        goBack() {
            this.$refs.seat.saveAll()
            this.$router.go(-1)
        },
        handleEditName() {
            this.form.editLayoutName = this.layoutName
            this.dialogVisible = true
        },
        submit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    updateSeatLayout({
                        conventionID: this.$route.query.conventionId,
                        seatLayoutID: this.$route.query.id,
                        layoutName: this.form.editLayoutName,
                    }).then((res) => {
                        this.dialogVisible = false
                        this.layoutName = this.form.editLayoutName
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                        })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.layout-page {
    width: 100%;
    height: 100%;
}
.layout-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    height: 36px;
}
.layout-wrapper {
    height: calc(100% - 36px);
    width: 100%;
}
.layout-name {
    font-size: 20px;
    padding-right: 15px;
}
.save-time {
    padding-left: 15px;
    font-size: 14px;
    color: #909399;
}
</style>
