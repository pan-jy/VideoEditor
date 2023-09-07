<template>
  <div class="text-form">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <FormItem title="X" units="px">
          <el-input-number
            v-model="textAttr.x"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="Y" units="px">
          <el-input-number
            v-model="textAttr.y"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="缩放" units="%">
          <el-slider
            style="width: 70%"
            v-model="textAttr.scale"
            show-input
            :min="0"
            :max="200"
            input-size="small"
            :format-tooltip="(v:number) => v + '%'"
          />
        </FormItem>
      </el-collapse-item>
      <el-collapse-item title="内容" name="2">
        <FormItem title="颜色">
          <el-color-picker
            v-model="textAttr.color"
            show-alpha
            :predefine="textAttr.predefineColors"
          />
          <template #value>
            <span :style="{ color: textAttr.color }">
              {{ textAttr.color }}
            </span>
          </template>
        </FormItem>
        <FormItem title="字号" units="px">
          <el-input-number v-model="textAttr.fontSize" size="small" :min="12" />
        </FormItem>
        <FormItem title="加粗">
          <el-switch
            v-model="textAttr.bold"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </FormItem>
        <FormItem title="内容">
          <el-input
            style="width: 80%"
            v-model="textAttr.content"
            :autosize="{ minRows: 1, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </FormItem>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useAttrStore } from '~/stores/attrStore'
import { TextAttr } from '~/types/attributes'

const props = defineProps<{ id: number }>()
const attrStore = useAttrStore()

const activeNames = reactive(['1', '2'])

const textAttr = computed(() => {
  return attrStore.attrMap.get(props.id) as TextAttr
})
</script>
