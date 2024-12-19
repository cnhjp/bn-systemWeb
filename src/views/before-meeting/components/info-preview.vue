<template>
    <div class="border-l border-gray-2 border-l-2px pl-20px pt-20px">
        <div class="lh-30px">首页预览图：</div>
        <div class="w-480px h-320px bg-#C41E1D flex-col flex-center">
            <el-image
                :src="formModel.picUrl"
                class="w-60px h-60px mb-10px"
                v-show="formModel.appIndexIsShowEmblem"
            ></el-image>
            <div class="text-20px text-white whitespace-pre">{{ formModel.title || '会丞相第一次全体会议' }}</div>
            <div class="text-38px text-white mb-10px" v-show="formModel.isShowPersonName">
                {{ userStore.userInfo.userName }}
            </div>
            <div
                class="px-30px py-2px bg-white color-#C41E1D rounded mb-10px"
                v-show="formModel.hasPreConventionSignInType"
            >
                签到
            </div>
            <div class="flex justify-center">
                <div
                    v-for="(file, index) in fileList.slice(0, 3)"
                    :key="index"
                    class="w-106px h-30px flex-center color-white rounded bg-white bg-opacity-30"
                    :class="{
                        'mr-20px': index !== fileList.length - 1,
                    }"
                >
                    {{ file }}
                </div>
            </div>
        </div>
        <div class="lh-30px text-gray-500">不同平板显示效果不同，预览图仅供参考，具体显示效果以实际为准</div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/src/store'
import { categoryList } from '~/src/api/before-meeting/info'

defineProps(['formModel'])

const userStore = useUserStore()
const route = useRoute()

const fileList = ref(['会议指南', '会议文件', '参阅材料'])

function getFileList() {
    if (route.query.conventionId) {
        categoryList({ conventionId: route.query.conventionId }).then((res) => {
            fileList.value = (res.data || []).map((item) => item.name)
        })
    }
}

getFileList()
</script>
