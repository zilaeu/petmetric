export default defineEventHandler(async (event) => {
  const env = getRuntimeEnv(event)
  const configuredToken = typeof env.ADMIN_TOKEN === 'string' ? env.ADMIN_TOKEN.trim() : ''
  const requestToken = getHeader(event, 'x-admin-token') || ''
  if (!configuredToken || requestToken !== configuredToken) { setResponseStatus(event, 401); return { error: 'Unauthorized' } }
  const bucket = env.BUCKET
  if (!hasBinding(bucket)) { setResponseStatus(event, 503); return { error: 'R2 media binding is not configured' } }
  const form = await readFormData(event)
  const file = form.get('file')
  if (!file || typeof file === 'string') { setResponseStatus(event, 400); return { error: 'Upload a file in the file field' } }
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
  if (!allowedTypes.has(file.type)) { setResponseStatus(event, 415); return { error: 'Upload a JPEG, PNG, WebP, or AVIF image' } }
  if (file.size > 5 * 1024 * 1024) { setResponseStatus(event, 413); return { error: 'Image must be 5 MB or smaller' } }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const key = `research/${Date.now()}-${safeName}`
  await bucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type || 'application/octet-stream' } })
  return { key, url: `/api/media/${encodeURIComponent(key)}`, size: file.size }
})
