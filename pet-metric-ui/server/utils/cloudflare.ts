export function getRuntimeEnv(event: any): any {
  return event.context.cloudflare?.env || {}
}

export function hasBinding(value: unknown): boolean {
  return Boolean(value && typeof value === 'object')
}
