import type { MockMethod } from 'vite-plugin-mock'
import type { ResourcesList } from '../src/datas/types/resources'
const mockMethods: MockMethod[] = [
  {
    url: '/api/getResources',
    method: 'get',
    response: ({ query }) => {
      const type = query.type
      let data: ResourcesList = []
      if (type === 'video') {
        data = [
          {
            title: '用户上传',
            type: 'video',
            items: [
              {
                name: 'video_1',
                format: 'mp4',
                cover: '/image/video/video_1.png',
                source: '/video/video_1.mp4',
                width: 1232,
                height: 720,
                fps: 30,
                frameCount: 712,
                time: 24000
              },
              {
                name: 'video_2',
                format: 'mp4',
                cover: '/image/video/video_2.png',
                source: '/video/video_2.mp4',
                width: 1242,
                height: 652,
                fps: 30,
                frameCount: 150,
                time: 5000
              }
            ]
          },
          {
            title: '热门',
            type: 'video',
            items: [
              {
                name: 'video_3',
                format: 'mp4',
                cover: '/image/video/video_3.png',
                source: '/video/video_3.mp4',
                width: 1242,
                height: 652,
                fps: 30,
                frameCount: 150,
                time: 5000
              }
            ]
          },
          {
            title: '搞笑片段',
            type: 'video',
            items: [
              {
                name: 'video_4',
                format: 'mp4',
                cover: '/image/video/video_4.png',
                width: 650,
                height: 652,
                frameCount: 150,
                fps: 30,
                source: '/video/video_4.mp4',
                time: 5000
              }
            ]
          }
        ]
      } else if (type === 'audio') {
        data = [
          {
            title: '抖音',
            type: 'audio',
            items: [
              {
                cover: '/image/audio/audio_0.png',
                time: 25000,
                format: 'mp3',
                name: '测试音频1',
                source: '/audio/audio_0.mp3'
              },
              {
                cover: '/image/audio/audio_1.png',
                time: 16000,
                format: 'mp3',
                name: '测试音频2',
                source: '/audio/audio_1.mp3'
              },
              {
                cover: '/image/audio/audio_2.png',
                time: 41000,
                format: 'mp3',
                name: '测试音频3',
                source: '/audio/audio_2.mp3'
              }
            ]
          },
          {
            title: '卡点',
            type: 'audio',
            items: [
              {
                cover: '/image/audio/audio_3.png',
                time: 14000,
                format: 'mp3',
                name: '测试音频4',
                source: '/audio/audio_3.mp3'
              },
              {
                cover: '/image/audio/audio_4.png',
                time: 25000,
                format: 'mp3',
                name: '测试音频5',
                source: '/audio/audio_4.mp3'
              }
            ]
          }
        ]
      } else if (type === 'text') {
        data = [
          {
            title: '热门',
            type: 'text',
            items: [
              {
                name: '文字1',
                templateId: 0,
                cover: '/image/text/text_0.png',
                source: '/image/text/text_0.png'
              },
              {
                name: '文字2',
                templateId: 0,
                cover: '/image/text/text_0.png',
                source: '/image/text/text_0.png'
              },
              {
                name: '文字3',
                templateId: 0,
                cover: '/image/text/text_0.png',
                source: '/image/text/text_0.png'
              },
              {
                name: '文字4',
                templateId: 0,
                cover: '/image/text/text_0.png',
                source: '/image/text/text_0.png'
              },
              {
                name: '文字5',
                templateId: 0,
                cover: '/image/text/text_0.png',
                source: '/image/text/text_0.png'
              },
              {
                name: '文字6',
                templateId: 1,
                cover: '/image/text/text_1.png',
                source: '/image/text/text_1.png'
              },
              {
                name: '文字7',
                templateId: 1,
                cover: '/image/text/text_1.png',
                source: '/image/text/text_1.png'
              },
              {
                name: '文字8',
                templateId: 1,
                cover: '/image/text/text_1.png',
                source: '/image/text/text_1.png'
              },
              {
                name: '文字9',
                templateId: 1,
                cover: '/image/text/text_1.png',
                source: '/image/text/text_1.png'
              },
              {
                name: '文字10',
                templateId: 1,
                cover: '/image/text/text_1.png',
                source: '/image/text/text_1.png'
              }
            ]
          }
        ]
      } else if (type === 'image') {
        data = [
          {
            title: '热门',
            type: 'image',
            items: [
              {
                name: '贴图1',
                cover: '/image/image/image_0.png',
                source: '/image/image/image_0.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '贴图2',
                cover: '/image/image/image_0.png',
                source: '/image/image/image_0.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '贴图3',
                cover: '/image/image/image_0.png',
                source: '/image/image/image_0.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '贴图4',
                cover: '/image/image/image_0.png',
                source: '/image/image/image_0.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '贴图5',
                cover: '/image/image/image_0.png',
                source: '/image/image/image_0.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              }
            ]
          },
          {
            title: '经典',
            type: 'image',
            items: [
              {
                name: '贴图6',
                cover: '/image/image/image_1.png',
                source: '/image/image/image_1.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '贴图7',
                cover: '/image/image/image_1.png',
                source: '/image/image/image_1.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '贴图8',
                cover: '/image/image/image_1.png',
                source: '/image/image/image_1.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '贴图9',
                cover: '/image/image/image_1.png',
                source: '/image/image/image_1.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              }
            ]
          }
        ]
      }
      return {
        code: 200,
        data
      }
    }
  }
]

export default mockMethods
