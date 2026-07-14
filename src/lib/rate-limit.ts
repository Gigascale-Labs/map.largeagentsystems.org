/** Extract a client IP from request headers. Falls back to a stable string so
 *  unknown-IP traffic still shares a single bucket rather than bypassing
 *  limits entirely. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip') ?? 'unknown'
}
