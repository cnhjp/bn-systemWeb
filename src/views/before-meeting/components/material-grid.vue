<template>
    <el-container class="wh-full">
        <el-main class="!p-0">
            <template v-if="list.length">
                <template v-for="(item, idx) of list" :key="idx">
                    <material-agenda-item
                        v-if="!isFile(item)"
                        :item="item"
                        :id="(item as any).id"
                        :name="`【${AGENDA_MAP[(item as any).agendaType]}】 ${(item as any).title}`"
                        :level="0"
                    />
                    <material-file-item
                        v-else
                        :item="item"
                        :id="(item as any).categoryDocumentID"
                        :name="(item as any).fileInfo.sourceName + (item as any).fileInfo.type"
                        :level="0"
                    />
                </template>
            </template>
            <template v-else>
                <div class="wh-full flex-center">暂无数据</div>
            </template>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import materialAgendaItem from './material-agenda-item.vue'
import materialFileItem from './material-file-item.vue'
import { AGENDA_MAP } from '~/src/constant/meeting'

defineProps({
    list: {
        type: Array,
        default: () => [],
    },
})

function isFile(item) {
    return !!item.categoryDocumentID
}
</script>
