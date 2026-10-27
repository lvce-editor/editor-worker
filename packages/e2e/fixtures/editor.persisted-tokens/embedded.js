export const hasArrayReturn = true
export const initialLineState = { state: 1 }
export const TokenMap = { 2: 'CacheEmbedded' }
export const tokenizeLine = (line) => {
  Reflect.set(globalThis, 'syntaxCacheTokenizeCalls', (Reflect.get(globalThis, 'syntaxCacheTokenizeCalls') || 0) + 1)
  return { state: 1, tokens: [2, line.length] }
}
