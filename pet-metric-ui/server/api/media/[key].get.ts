export default defineEventHandler(async (event) => {
  const bucket = getRuntimeEnv(event).BUCKET
  if (!hasBinding(bucket)) {
    setResponseStatus(event, 503)
    return 'R2 media binding is not configured'
  }
  const key = decodeURIComponent(getRouterParam(event, 'key') || '')
  const object = await bucket.get(key)
  if (!object) { setResponseStatus(event, 404); return 'Media not found' }
  setHeader(event, 'content-type', object.httpMetadata?.contentType || 'application/octet-stream')
  setHeader(event, 'etag', object.httpEtag)
  return object.body
})
