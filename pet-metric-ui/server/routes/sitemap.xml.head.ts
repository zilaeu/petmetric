export default defineEventHandler((event) => {
  setResponseStatus(event, 200)
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')
  return ''
})
