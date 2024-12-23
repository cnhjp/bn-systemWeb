<template>
    <el-container class="wh-full">
        <el-header height="170px">
            <el-form inline class="pt-20px mb-20px">
                <el-form-item label="会议名称">
                    <el-select v-model="formModel.conventionGroupId" class="meeting-select" @change="onRefresh">
                        <el-option
                            v-for="item in dropMeeting"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="统计时长">
                    <el-select v-model="formModel.timedStatus" @change="onRefresh">
                        <el-option
                            v-for="item in dropTimedStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="total-wrapper el-flex">
                <div class="total-item el-round">
                    <div class="type">最近用餐人数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.lastPersonCount }}
                        <img src="@/assets/images/meal-manage/img-1.svg" />
                    </div>
                </div>
                <div class="total-item el-round">
                    <div class="type">最近用餐次数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.lastTotalTimes }}
                        <img src="@/assets/images/meal-manage/img-2.svg" />
                    </div>
                </div>
                <div class="total-item el-round">
                    <div class="type">今日用餐人数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.todayPersonCount }}
                        <img src="@/assets/images/meal-manage/img-3.svg" />
                    </div>
                </div>
                <div class="total-item el-round">
                    <div class="type">今日用餐次数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.todayTotalTimes }}
                        <img src="@/assets/images/meal-manage/img-4.svg" />
                    </div>
                </div>
                <div class="total-item el-round">
                    <div class="type">累计用餐人数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.personCount }}
                        <img src="@/assets/images/meal-manage/img-5.svg" />
                    </div>
                </div>
                <div class="total-item el-round">
                    <div class="type">累计用餐次数</div>
                    <div class="el-flex is-center-between num">
                        {{ totalDetail.totalTimes }}
                        <img src="@/assets/images/meal-manage/img-6.svg" />
                    </div>
                </div>
            </div>
        </el-header>
        <el-main v-if="visible">
            <!--            <div class="el-flex">-->
            <!--                <div class="pie-chart">用餐占比</div>-->
            <!--                <div class="line-chart">用餐趋势图</div>-->
            <!--            </div>-->
            <div class="list-wrapper el-bg--white p-20px">
                <list :conventionGroupId="formModel.conventionGroupId" />
            </div>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { dropDownConvention } from '@/api/common'
import { DropResponse } from '@/api/common/types.ts'
import { dropDownTimedStatus, getMealsTotal } from '@/api/meal-manage'
import List from './components/list.vue'

const visible = ref(false)
const formModel = ref({
    conventionGroupId: 0,
    timedStatus: 0,
})

const totalDetail = ref<any>({
    lastPersonCount: '',
    lastTotalTimes: '',
    todayPersonCount: '',
    todayTotalTimes: '',
    personCount: '',
    totalTimes: '',
})

async function getMealDetail() {
    await getMealsTotal(formModel.value).then((res) => {
        totalDetail.value = res.data
        visible.value = true
    })
}
async function onRefresh() {
    visible.value = false
    await getMealDetail()
}

const dropMeeting = ref<DropResponse[]>([])
const dropTimedStatus = ref<DropResponse[]>([])
async function init() {
    await dropDownConvention().then((res) => {
        dropMeeting.value = res.data
        formModel.value.conventionGroupId = dropMeeting.value.length > 0 ? dropMeeting.value[0].value : null
    })
    await dropDownTimedStatus().then((res) => {
        dropTimedStatus.value = res.data
        formModel.value.timedStatus = dropTimedStatus.value.length > 0 ? dropTimedStatus.value[0].value : null
    })
    await getMealDetail()
}
init()
</script>

<style scoped lang="scss">
.meeting-select {
    width: 300px;
}
.total-wrapper {
    margin: 0 -8px;
    line-height: 1;
    .total-item {
        position: relative;
        flex: 1;
        height: 98px;
        margin: 0 8px;
        padding: 23px 12px 9px 14px;
        border: 2px solid #ffffff;
        .type {
            margin-bottom: 5px;
        }
        .num {
            font-size: 24px;
            font-weight: bold;
        }
        &:nth-of-type(1) {
            background: linear-gradient(to bottom, #f0f1fd 0%, #ffffff 60%);
            .type {
                color: #757ccd;
            }
        }
        &:nth-of-type(2) {
            background: linear-gradient(to bottom, #fff4ed 0%, #ffffff 60%);
            .type {
                color: #e58a4f;
            }
        }
        &:nth-of-type(3) {
            background: linear-gradient(to bottom, #e3faff 0%, #ffffff 60%);
            .type {
                color: #3eb0cd;
            }
        }
        &:nth-of-type(4) {
            background: linear-gradient(to bottom, #ebf9e0 0%, #ffffff 60%);
            .type {
                color: #68ac36;
            }
        }
        &:nth-of-type(5) {
            background: linear-gradient(to bottom, #fdf0f5 0%, #ffffff 60%);
            .type {
                color: #d15e92;
            }
        }
        &:nth-of-type(6) {
            background: linear-gradient(to bottom, #e9f1ff 0%, #ffffff 60%);
            .type {
                color: #6390dd;
            }
        }
    }
}
.list-wrapper {
    height: 100%;
}
</style>
