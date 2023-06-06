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
    const suffixName = getResourcesFormat(file)
    return fontFileTypeSet.has(suffixName.toLowerCase()) ? 'text' : undefined
  }
}

function getResourcesFormat(file: File): string {
  return file.name.split('.').splice(-1)[0]
}

export { getResourcesType, getResourcesFormat }
