<template>
  <div class="image-form">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <FormItem title="X" units="px">
          <el-input-number
            v-model="videoAttr.x"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="Y" units="px">
          <el-input-number
            v-model="videoAttr.y"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="缩放" units="%">
          <el-slider
            style="width: 70%"
            v-model="videoAttr.scale"
            show-input
            :min="0"
            :max="200"
            input-size="small"
            :format-tooltip="(v:number) => v + '%'"
          />
        </FormItem>
      </el-collapse-item>
      <el-collapse-item title="内容" name="2">
        <FormItem title="静音">
          <el-switch
            v-model="videoAttr.silence"
            inline-prompt
            active-text="是"
            inactive-text="否"
          />
        </FormItem>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAttrState } from '~/stores/attrState'
import { VideoAttr } from '~/types/attributes'

const props = defineProps<{ id: number }>()
const attrState = useAttrState()

const activeNames = reactive(['1', '2'])

const videoAttr = attrState.attrMap.get(props.id) as VideoAttr
</script>
