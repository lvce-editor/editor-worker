import { commentToken, TokenMap } from './helper.js'

export { TokenMap }
export const hasArrayReturn = true
export const initialLineState = { state: 1 }

export const tokenizeLine = (line, previous) => {
  Reflect.set(globalThis, 'syntaxCacheTokenizeCalls', (Reflect.get(globalThis, 'syntaxCacheTokenizeCalls') || 0) + 1)
  const comment = previous.state === 2 || line.startsWith('/*')
  return {
    state: line.includes('*/') ? 1 : comment ? 2 : 1,
    tokens: [comment ? commentToken : 1, line.length],
    ...(line.startsWith('@') && {
      embeddedLanguage: 'cache-embedded',
      embeddedLanguageStart: 0,
      embeddedLanguageEnd: line.length,
    }),
  }
}
