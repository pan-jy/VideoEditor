export default function (file: File) {
  if (file.type) {
    const type = file.type.split('/')[0]
    if (type === 'font') return 'text'
    return type
  } else {
    const fontFileTypeSet = new Set(['ttf', 'otf', 'woff', 'woff2'])
    const suffixName = file.name.split('.').splice(-1)[0]
    return fontFileTypeSet.has(suffixName.toLowerCase()) ? 'font' : ''
  }
}
