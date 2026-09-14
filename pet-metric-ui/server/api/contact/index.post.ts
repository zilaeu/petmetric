export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const allowedTypes = new Set(['correction', 'question', 'press', 'other'])
  const type = allowedTypes.has(String(body?.type)) ? String(body.type) : 'other'
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  const message = String(body?.message || '').trim()
  const url = String(body?.url || '').trim()
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10 || message.length > 5000 || url.length > 2000) {
    setResponseStatus(event, 400)
    return { error: 'Please provide a name, a valid email, and a message of at least 10 characters.' }
  }
  const db = getRuntimeEnv(event).DB
  if (!hasBinding(db)) return { ok: true, source: 'local-fallback', message: 'Thanks — the form was validated in local development.' }
  await db.prepare('INSERT INTO correction_requests (request_type, name, email, url, message) VALUES (?, ?, ?, ?, ?)').bind(type, name, email, url || null, message).run()
  const responseMessage = type === 'correction'
    ? 'Thanks — we will review your correction within five business days.'
    : 'Thanks — we will review your message and respond within five business days.'
  return { ok: true, source: 'd1', message: responseMessage }
})
