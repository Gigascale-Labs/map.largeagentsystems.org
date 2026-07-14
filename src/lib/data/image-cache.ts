import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import crypto from 'crypto'

const CACHE_DIR = path.join(process.cwd(), 'public', 'images', 'logo-cache')
const CONCURRENCY = 20
const DOWNLOAD_MAX_RETRIES = 3
const DOWNLOAD_RETRY_DELAY_MS = 2000
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])

const ALLOWED_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.webp',
  '.gif',
  '.avif',
  '.ico',
]

function getExtension(url: string, filename: string): string | null {
  const filenameExt = path.extname(filename).toLowerCase()
  if (filenameExt && ALLOWED_EXTENSIONS.includes(filenameExt)) {
    return filenameExt
  }

  const urlPath = new URL(url).pathname
  const urlExt = path.extname(urlPath).toLowerCase()
  if (urlExt && ALLOWED_EXTENSIONS.includes(urlExt)) {
    return urlExt
  }

  return null
}

const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpeg',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/x-icon': '.ico',
  'image/vnd.microsoft.icon': '.ico',
}

function extensionFromContentType(
  contentType: string | undefined
): string | null {
  if (!contentType) return null
  const mime = contentType.split(';')[0].trim().toLowerCase()
  return CONTENT_TYPE_EXTENSIONS[mime] ?? null
}

// Some CDNs (e.g. Airtable's attachment URLs) serve images at opaque paths
// with no file extension at all, so the real format is only knowable from
// the server's declared Content-Type. HEAD request, following redirects.
function probeContentType(url: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.request(url, { method: 'HEAD' }, response => {
      response.resume() // drain so the socket can close
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location
        if (redirectUrl) {
          probeContentType(redirectUrl).then(resolve).catch(reject)
          return
        }
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`))
        return
      }
      resolve(response.headers['content-type'])
    })
    req.on('error', reject)
    req.end()
  })
}

// Resolves a file extension for a URL, using the URL/filename text when it
// reveals one, otherwise sniffing the real Content-Type header. Never
// defaults to a guessed extension — throws if the format can't be determined
// or isn't a recognized image type.
async function resolveExtension(url: string): Promise<string> {
  const fromUrl = getExtension(url, url)
  if (fromUrl) return fromUrl

  const contentType = await probeContentType(url)
  const fromContentType = extensionFromContentType(contentType)
  if (fromContentType) return fromContentType

  throw new Error(
    `Unknown image format for "${url}": no extension in the URL and ` +
      `Content-Type was "${contentType ?? '(none)'}". ` +
      `Allowed formats: ${ALLOWED_EXTENSIONS.join(', ')}`
  )
}

function parseHttpStatus(message: string): number {
  const match = message.match(/^HTTP (\d+)$/)
  return match ? parseInt(match[1], 10) : 0
}

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  if (RETRYABLE_STATUS_CODES.has(parseHttpStatus(message))) return true
  const networkErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'EPIPE',
    'EAI_AGAIN',
    'socket hang up',
  ]
  return networkErrors.some(e => message.includes(e))
}

function downloadFileOnce(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    file.on('error', err => {
      reject(err)
    })
    const protocol = url.startsWith('https') ? https : http

    protocol
      .get(url, response => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location
          if (redirectUrl) {
            file.close()
            fs.unlinkSync(dest)
            downloadFileOnce(redirectUrl, dest).then(resolve).catch(reject)
            return
          }
        }

        if (response.statusCode !== 200) {
          file.close()
          fs.unlinkSync(dest)
          reject(new Error(`HTTP ${response.statusCode}`))
          return
        }

        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      })
      .on('error', err => {
        file.close()
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

async function downloadFile(url: string, dest: string): Promise<void> {
  for (let attempt = 0; attempt <= DOWNLOAD_MAX_RETRIES; attempt++) {
    try {
      await downloadFileOnce(url, dest)
      return
    } catch (error) {
      if (!isRetryableError(error) || attempt === DOWNLOAD_MAX_RETRIES) {
        throw error
      }
      const delay = DOWNLOAD_RETRY_DELAY_MS * Math.pow(2, attempt)
      const message = error instanceof Error ? error.message : String(error)
      console.warn(
        `Download failed (${message}), retrying in ${delay}ms... (attempt ${attempt + 1}/${DOWNLOAD_MAX_RETRIES})`
      )
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

// The cache lives under public/ so it can be served as static assets. That
// works at build time (writable filesystem) but not at request time on
// Vercel serverless (read-only). When the cache dir isn't writable, callers
// skip caching and leave the original remote URL in place — it's valid long
// enough for an interactive request.
function ensureCacheDir(): boolean {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true })
    }
    return true
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'EROFS' || code === 'EACCES' || code === 'ENOENT') {
      return false
    }
    throw err
  }
}

// Downloads and caches plain image URLs (CSV-sourced logo fields) on disk,
// keyed by a hash of the URL since there's no attachment id to key off of.
export async function downloadAndCacheUrls(
  urls: string[]
): Promise<Map<string, string>> {
  const result = new Map<string, string>()
  if (urls.length === 0) return result

  if (!ensureCacheDir()) {
    for (const url of urls) result.set(url, url)
    return result
  }

  const failures: string[] = []

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY)
    const results = await Promise.allSettled(
      batch.map(async url => {
        const ext = await resolveExtension(url)
        const hash = crypto
          .createHash('sha1')
          .update(url)
          .digest('hex')
          .slice(0, 16)
        const localFilename = `${hash}${ext}`
        const localPath = path.join(CACHE_DIR, localFilename)
        if (!fs.existsSync(localPath)) {
          await downloadFile(url, localPath)
        }
        return `/images/logo-cache/${localFilename}`
      })
    )

    for (let j = 0; j < results.length; j++) {
      const url = batch[j]
      const outcome = results[j]
      if (outcome.status === 'fulfilled') {
        result.set(url, outcome.value)
      } else {
        failures.push(`${url}: ${outcome.reason}`)
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Failed to download ${failures.length} logo images:\n${failures.join('\n')}`
    )
  }

  return result
}
