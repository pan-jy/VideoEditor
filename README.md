# VideoEdit

## 介绍
基于 ffmpeg 的使用 vue3 + ts 开发的纯前端视频剪辑器

## 特性
1. 完整的eslint、stylelint配置，严格的ts类型限制
2. vue3 + ts + vite + vueuse + pinia
3. ffmpeg、wasm 底层音视频处理集成
4. WebWorker + OffscreenCanvas 异步进行帧计算、绘制

## 功能
1. 支持深色模式（使用element-plus）
2. 支持云素材（暂为mock模拟）以及本地上传素材
3. 支持拖拽添加资源（拖拽放置时显示提示线）
4. 支持表单调整资源位置、属性
5. 支持音视频裁剪，以及添加贴图、文字
6. 支持时间轴缩放（ctrl+滚轮），最多显示30帧
7. 支持播放预览
8. 支持操作撤销、重做功能

## 下一步
1. 添加导出功能
2. 添加拖拽调节资源大小、位置功能
3. 添加持久化存储功能
4. **改善性能**
5. ...

## 预览
![image](https://github.com/pan-jy/VideoEditor/assets/81850790/aea240da-647b-42ba-aaf0-3b1f6b58d672)

![image](https://github.com/pan-jy/VideoEditor/assets/81850790/03379ad5-d599-496d-ad1d-0d69c517275e)

![image](https://github.com/pan-jy/VideoEditor/assets/81850790/6f95f1c1-f1fd-4984-b22c-eaff9bd3c5a8)


