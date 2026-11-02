// Pages are prerendered and served as files before this runs. Anything that reaches here
// with no matching file gets the 404 shell, which renders the not-found page in the browser.
export default defineEventHandler(async event => {
  if (import.meta.prerender) return
  const path = event.path.split('?')[0]
  if (event.method !== 'GET' || path === '/404.html' || path.startsWith('/__') || path.startsWith('/_nuxt/')) return
  setResponseStatus(event, 404)
  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8')
  return await $fetch<string>('/404.html', { responseType: 'text' })
})
