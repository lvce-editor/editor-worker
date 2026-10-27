import { CacheWorker } from '@lvce-editor/rpc-registry'
import type { CachedViewport } from '../SyntaxHighlightingCacheCodec/SyntaxHighlightingCacheCodec.ts'
import * as SyntaxHighlightingCacheCodec from '../SyntaxHighlightingCacheCodec/SyntaxHighlightingCacheCodec.ts'
import * as SyntaxHighlightingState from '../SyntaxHighlightingState/SyntaxHighlightingState.ts'
import * as TokenizerFingerprint from '../TokenizerFingerprint/TokenizerFingerprint.ts'
import * as TokenizerState from '../TokenizerState/TokenizerState.ts'

const cacheName = 'lvce-editor-syntax-highlighting-v1'
const lifetime = 90 * 24 * 60 * 60 * 1000
const fingerprints = new Map<string, Promise<string>>()
// Editor line arrays are immutable snapshots; edits replace the array. Weak
// ownership releases old content hashes when undo/editor state releases a snapshot.
const contentHashes = new WeakMap<readonly string[], Promise<string>>()

const hash = async (value: unknown): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)))
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')
}

export const getKey = async (editor: any, start: number, end: number): Promise<string> => {
  if (editor.syntaxHighlightingCacheEnabled !== true || editor.largeFile || !TokenizerState.getTokenizePath(editor.languageId)) {
    return ''
  }
  try {
    const paths = TokenizerState.getTokenizePaths()
    const catalog = JSON.stringify(paths)
    let fingerprint = fingerprints.get(catalog)
    if (!fingerprint) {
      fingerprint = (async () => {
        try {
          return await TokenizerFingerprint.getFingerprint(paths)
        } catch {
          return ''
        }
      })()
      fingerprints.set(catalog, fingerprint)
    }
    const code = await fingerprint
    if (!code) {
      return ''
    }
    let contentHash = contentHashes.get(editor.lines)
    if (!contentHash) {
      contentHash = hash(editor.lines)
      contentHashes.set(editor.lines, contentHash)
    }
    const key = await hash([
      editor.assetDir,
      SyntaxHighlightingState.getEnabled(),
      editor.languageId,
      TokenizerState.getTokenizePath(editor.languageId),
      code,
      start,
      end,
      await contentHash,
    ])
    return `https://lvce-editor.invalid/syntax-highlighting/v1/${key}`
  } catch {
    return ''
  }
}

export const get = async (key: string, lineLengths: readonly number[]): Promise<CachedViewport | undefined> => {
  try {
    const item = await CacheWorker.getCacheStorageItem(key, cacheName)
    if (!item) {
      return undefined
    }
    const result = SyntaxHighlightingCacheCodec.decode(item.body, lineLengths, Date.now())
    if (!result) {
      await CacheWorker.removeCacheStorageItem(key, cacheName)
    }
    return result
  } catch {
    return undefined
  }
}

export const set = async (key: string, result: CachedViewport): Promise<void> => {
  try {
    const buffer = SyntaxHighlightingCacheCodec.encode(result, Date.now() + lifetime)
    if (buffer) {
      await CacheWorker.setCacheStorageItem(key, buffer, cacheName, { 'content-type': 'application/octet-stream' })
    }
  } catch {
    // Persistence is optional, including when a tokenizer returns unsupported data.
  }
}
