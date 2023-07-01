<template>
  <div class="attr-form">
    <component
      style="width: 100%"
      v-if="trackState.focusedItem?.type"
      :id="trackState.focusedItem.id"
      :is="componentMap[trackState.focusedItem.type]"
    />
    <el-empty
      class="form-empty"
      v-show="trackState.focusedItem === undefined"
      image="/empty.png"
      image-size="100%"
      description="点击轨道进行编辑"
    />
  </div>
</template>

<script setup lang="ts">
import TextForm from './attrForm/TextForm.vue'
import ImageForm from './attrForm/ImageForm.vue'
import VideoForm from './attrForm/VideoForm.vue'
import AudioForm from './attrForm/AudioForm.vue'
import { useTrackState } from '~/stores/trackState'
import { TrackType } from '~/types/tracks'

const trackState = useTrackState()

const componentMap: { [K in TrackType]: never } = {
  text: TextForm as never,
  image: ImageForm as never,
  video: VideoForm as never,
  audio: AudioForm as never
}
</script>

<style lang="scss" scoped>
.attr-form {
  display: flex;
  height: 100%;
  overflow-y: auto;
}

.form-empty {
  align-self: center;
}
</style>
