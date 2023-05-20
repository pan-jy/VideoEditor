export async function fetchFile(source: string, fileName: string) {
  const res = await fetch(source)
  const blob = await res.blob()
  const type = res.headers.get('content-type') ?? blob.type
  return new File([blob], fileName, { type: type })
}
