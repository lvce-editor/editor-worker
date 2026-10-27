import { init, parse } from 'es-module-lexer/js'

// Hash the entire static module graph, including re-exports and literal dynamic
// imports. Unknown import targets cannot produce a trustworthy persistent key.
export const getFingerprint = async (paths: readonly string[]): Promise<string> => {
  await init()
  const sources = new Map<string, string>()
  const signal = AbortSignal.timeout(5000)
  let totalBytes = 0
  const visit = async (url: string): Promise<void> => {
    if (sources.has(url)) {
      return
    }
    if (!/^https?:/.test(url)) {
      throw new Error('Unsupported tokenizer URL')
    }
    if (sources.size >= 256) {
      throw new Error('Tokenizer module graph is too large')
    }
    const response = await fetch(url, { cache: 'no-cache', signal })
    if (!response.ok) {
      throw new Error('Cannot read tokenizer source')
    }
    const source = await response.text()
    totalBytes += source.length * 2
    if (totalBytes > 8 * 1024 * 1024) {
      throw new Error('Tokenizer module is too large')
    }
    sources.set(url, source)
    const [imports] = parse(source)
    for (const entry of imports) {
      if (entry.type === 'import-meta' || (entry.type === 'dynamic' && entry.glob)) {
        // import.meta can expose resources outside the parsed module graph.
        throw new Error('Tokenizer uses import.meta')
      }
      if (!entry.specifier || (!entry.specifier.startsWith('.') && !entry.specifier.startsWith('/') && !/^https?:/.test(entry.specifier))) {
        throw new Error('Tokenizer has an unresolved dependency')
      }
      await visit(new URL(entry.specifier, url).href)
    }
  }
  const sortedPaths = paths.toSorted((a, b) => a.localeCompare(b))
  for (const path of sortedPaths) {
    await visit(new URL(path, globalThis.location.href).href)
  }
  const bytes = new TextEncoder().encode(JSON.stringify([...sources].toSorted(([a], [b]) => a.localeCompare(b))))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('')
}
