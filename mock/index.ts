import type { MockMethod } from 'vite-plugin-mock'
import type { ResourcesList } from '../src/types/resources'
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
            title: '转场',
            type: 'video',
            items: [
              {
                name: '故障雪花屏.mp4',
                format: 'mp4',
                cover: '/image/video/故障雪花屏.jpg',
                source: '/video/故障雪花屏.mp4',
                width: 1920,
                height: 1080,
                fps: 30,
                frameCount: 30,
                time: 1000
              },
              {
                name: '海绵宝宝later.mp4',
                format: 'mp4',
                cover: '/image/video/海绵宝宝later.jpg',
                source: '/video/海绵宝宝later.mp4',
                width: 2880,
                height: 2160,
                fps: 30,
                frameCount: 30,
                time: 1
              }
            ]
          },
          {
            title: '热门',
            type: 'video',
            items: [
              {
                name: '土拨鼠叫.mp4',
                format: 'mp4',
                cover: '/image/video/土拨鼠叫.jpg',
                source: '/video/土拨鼠叫.mp4',
                width: 1080,
                height: 1080,
                fps: 30,
                frameCount: 150,
                time: 5000
              }
            ]
          }
        ]
      } else if (type === 'audio') {
        data = [
          {
            title: '旋律',
            type: 'audio',
            items: [
              {
                cover: '/image/audio/Charms.jpg',
                time: 244000,
                format: 'mp3',
                name: 'Charms.mp3',
                singer: 'Abel Korzeniowski',
                source: '/audio/Abel Korzeniowski - Charms.mp3'
              },
              {
                cover: '/image/audio/Let Me Down Slowly.jpg',
                time: 169000,
                format: 'mp3',
                name: 'Let Me Down Slowly.mp3',
                singer: 'Alec Benjamin,Alessia Cara',
                source:
                  '/audio/Alec Benjamin,Alessia Cara - Let Me Down Slowly.mp3'
              },
              {
                cover: '/image/audio/Savage.jpg',
                time: 41000,
                format: 'mp3',
                name: 'Savage.mp3',
                singer: 'Bahari',
                source: '/audio/Bahari - Savage.mp3'
              }
            ]
          },
          {
            title: '宁静',
            type: 'audio',
            items: [
              {
                cover: '/image/audio/Rainbow Mile.jpg',
                time: 194000,
                format: 'mp3',
                name: 'Rainbow Mile.mp3',
                singer: 'Kryust',
                source: '/audio/Kryust - Rainbow Mile.mp3'
              },
              {
                cover: '/image/audio/Hold Me.jpg',
                time: 207000,
                format: 'mp3',
                name: 'Hold Me.mp3',
                singer: 'Michael FK,Liam Thomas',
                source: '/audio/Michael FK,Liam Thomas - Hold Me.mp3'
              },
              {
                cover: '/image/audio/Beautiful Dreamer.jpg',
                time: 200000,
                format: 'mp3',
                name: 'Beautiful Dreamer.mp3',
                singer: 'surku',
                source: '/audio/surku - Beautiful Dreamer.mp3'
              },
              {
                cover: '/image/audio/Seeker.jpg',
                time: 246000,
                format: 'mp3',
                name: 'Seeker.mp3',
                singer: 'Vesky',
                source: '/audio/Vesky - Seeker.mp3'
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
                name: 'CherryBombOne.ttf',
                templateId: 0,
                source: '/text/CherryBombOne-Regular.ttf',
                format: 'truetype'
              },
              {
                name: '刘建毛笔草书.ttf',
                templateId: 0,
                source: '/text/LiuJianMaoCao-Regular.ttf',
                format: 'truetype'
              },
              {
                name: 'Nabla彩色可变字体.woff2',
                templateId: 0,
                source: '/text/Nabla彩色可变字体.woff2',
                format: 'woff2'
              },
              {
                name: 'MaShanZheng.ttf',
                templateId: 0,
                source: '/text/MaShanZheng-Regular.ttf',
                format: 'truetype'
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
                name: '666.gif',
                cover: '/image/image/666.gif',
                source: '/image/image/666.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '比心.gif',
                cover: '/image/image/比心.gif',
                source: '/image/image/比心.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '手枪比心.gif',
                cover: '/image/image/手枪比心.gif',
                source: '/image/image/手枪比心.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '心球.gif',
                cover: '/image/image/心球.gif',
                source: '/image/image/心球.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '鼓掌.gif',
                cover: '/image/image/鼓掌.gif',
                source: '/image/image/鼓掌.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '红圈.gif',
                cover: '/image/image/红圈.gif',
                source: '/image/image/红圈.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 8
              },
              {
                name: '加油.gif',
                cover: '/image/image/加油.gif',
                source: '/image/image/加油.gif',
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
                name: '喇叭.gif',
                cover: '/image/image/喇叭.gif',
                source: '/image/image/喇叭.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '马赛克.gif',
                cover: '/image/image/马赛克.gif',
                source: '/image/image/马赛克.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '马赛克小人.gif',
                cover: '/image/image/马赛克小人.gif',
                source: '/image/image/马赛克小人.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '闪光.gif',
                cover: '/image/image/闪光.gif',
                source: '/image/image/闪光.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '星星.gif',
                cover: '/image/image/星星.gif',
                source: '/image/image/星星.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '音波.gif',
                cover: '/image/image/音波.gif',
                source: '/image/image/音波.gif',
                format: 'gif',
                width: 199,
                height: 200,
                sourceFrame: 6
              },
              {
                name: '音符.gif',
                cover: '/image/image/音符.gif',
                source: '/image/image/音符.gif',
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
