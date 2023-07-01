<template>
  <div class="image-form">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="内容" name="1">
        <FormItem title="静音">
          <el-switch
            v-model="audioAttr.silence"
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
import { AudioAttr } from '~/types/attributes'

const props = defineProps<{ id: number }>()
const attrState = useAttrState()

const activeNames = reactive(['1'])

const audioAttr = attrState.attrMap.get(props.id) as AudioAttr
</script>
