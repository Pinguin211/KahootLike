function normalizeBaseUrl(rawBase: string): string {
  const trimmed = rawBase.trim()
  if (!trimmed) return '/'

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

const publicBaseUrl = normalizeBaseUrl(
  import.meta.env.VITE_PUBLIC_JSON_BASE_URL ?? import.meta.env.BASE_URL ?? '/',
)

export function getPublicUrl(relativePath: string): string {
  const cleanPath = relativePath.replace(/^\/+/, '')
  return `${publicBaseUrl}${cleanPath}`
}

