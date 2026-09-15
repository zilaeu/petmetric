export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true }).toLowerCase()
  if (host !== 'www.petmetricus.com') return

  return sendRedirect(event, `https://petmetricus.com${event.path}`, 301)
})
