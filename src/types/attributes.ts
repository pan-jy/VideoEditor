class BaseAttr {
  x: number
  y: number
  scale: number

  constructor() {
    this.x = 0
    this.y = 0
    this.scale = 100
  }
}

class TextAttr extends BaseAttr {
  content: string
  color: string
  fontSize: number
  bold: boolean
  predefineColors: Array<string>
  constructor() {
    super()
    this.content = '默认内容'
    this.color = '#1e90ff'
    this.fontSize = 30
    this.bold = false
    this.predefineColors = [
      '#000000',
      '#ffffff',
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      'rgba(255, 69, 0, 0.68)',
      'rgb(255, 120, 0)',
      'hsv(51, 100, 98)',
      'hsva(120, 40, 94, 0.5)',
      'hsl(181, 100%, 37%)',
      'hsla(209, 100%, 56%, 0.73)',
      '#c7158577'
    ]
  }
}

class ImageAttr extends BaseAttr {
  constructor() {
    super()
  }
}

class VideoAttr extends BaseAttr {
  silence: boolean

  constructor() {
    super()
    this.silence = false
  }
}

class AudioAttr {
  silence: boolean
  constructor() {
    this.silence = false
  }
}

type ItemAttr = TextAttr | ImageAttr | VideoAttr | AudioAttr

export { TextAttr, ImageAttr, VideoAttr, AudioAttr }
export type { ItemAttr }
