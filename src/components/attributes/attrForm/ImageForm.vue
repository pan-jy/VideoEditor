<template>
  <div class="image-form">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="位置" name="1">
        <FormItem title="X" units="px">
          <el-input-number
            v-model="imageAttr.x"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="Y" units="px">
          <el-input-number
            v-model="imageAttr.y"
            :min="0"
            size="small"
            controls-position="right"
          />
        </FormItem>
        <FormItem title="缩放" units="%">
          <el-slider
            style="width: 70%"
            v-model="imageAttr.scale"
            show-input
            :min="0"
            :max="200"
            input-size="small"
            :format-tooltip="(v:number) => v + '%'"
          />
        </FormItem>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useAttrStore } from '~/stores/attrStore'
import { ImageAttr } from '~/types/attributes'

const props = defineProps<{ id: number }>()
const attrStore = useAttrStore()

const activeNames = reactive(['1'])

const imageAttr = attrStore.attrMap.get(props.id) as ImageAttr
</script>
