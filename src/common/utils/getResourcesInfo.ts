import type { TrackType } from '~/types/tracks'
function getResourcesType(file: File): TrackType | undefined {
  const trackType = new Set(['video', 'audio', 'text', 'image'])
  if (file.type) {
    const type = file.type.split('/')[0]
    if (type === 'font') return 'text'
    if (!trackType.has(type)) return undefined
    return type as TrackType
  } else {
    const fontFileTypeSet = new Set(['ttf', 'otf', 'woff', 'woff2'])
    const { format } = getFileName(file.name)
    return fontFileTypeSet.has(format.toLowerCase()) ? 'text' : undefined
  }
}

function getFileName(fileName: string) {
  const nameArr = fileName.split('.')
  const format = nameArr.splice(-1)[0]
  const name = nameArr.join('.')
  return {
    name,
    format
  }
}

export { getResourcesType, getFileName }
