type Context = 'code' | 'single' | 'double' | 'template' | 'lineComment' | 'blockComment' | 'regex'

interface Frame {
  readonly context: Context
  depth: number
}

const expressionKeywords = new Set(['return', 'throw', 'yield', 'await', 'typeof', 'void', 'delete', 'case', 'new', 'in', 'of'])
const isIdentifier = (character: string): boolean => /[\w$]/u.test(character)

// Scan the document prefix, retaining lexical state across lines and nested template expressions.
export const isTypeScriptCode = (text: string): boolean => {
  const frames: Frame[] = [{ context: 'code', depth: 0 }]
  let expressionStart = true
  let regexClass = false
  scan: for (let index = 0; index < text.length; index++) {
    const frame = frames.at(-1)!
    const character = text[index]
    const next = text[index + 1]
    switch (frame.context) {
      case 'blockComment':
        if (character === '*' && next === '/') {
          frames.pop()
          index++
        }
        continue scan
      case 'code':
        if (character === '/' && next === '/') {
          frames.push({ context: 'lineComment', depth: 0 })
          index++
        } else if (character === '/' && next === '*') {
          frames.push({ context: 'blockComment', depth: 0 })
          index++
        } else if (["'", '"', '`'].includes(character)) {
          frames.push({ context: character === "'" ? 'single' : character === '"' ? 'double' : 'template', depth: 0 })
        } else if (character === '/' && expressionStart) {
          frames.push({ context: 'regex', depth: 0 })
          regexClass = false
        } else if (character === '{') {
          frame.depth++
          expressionStart = true
        } else if (character === '}') {
          frame.depth--
          if (frame.depth === 0 && frames.length > 1) {
            frames.pop()
          }
          expressionStart = false
        } else if (isIdentifier(character)) {
          const start = index
          while (index + 1 < text.length && isIdentifier(text[index + 1])) {
            index++
          }
          expressionStart = expressionKeywords.has(text.slice(start, index + 1))
        } else if (!/\s/u.test(character)) {
          expressionStart = '=(:,[!&|?;+-*%<>'.includes(character)
        }
        continue scan
      case 'double':
      case 'single':
        if (character === '\\') {
          index++
        } else if ([frame.context === 'single' ? "'" : '"', '\n', '\r'].includes(character)) {
          frames.pop()
          expressionStart = false
        }
        continue scan
      case 'lineComment':
        if (['\n', '\r'].includes(character)) {
          frames.pop()
        }
        continue scan
      case 'regex':
        switch (character) {
          case '[': {
            regexClass = true

            continue scan
          }
          case ']': {
            regexClass = false

            continue scan
          }
          case '\\': {
            index++

            continue scan
          }
          default:
            if ((character === '/' && !regexClass) || ['\n', '\r'].includes(character)) {
              frames.pop()
              expressionStart = false
            }
        }
        continue scan
      case 'template':
        if (character === '\\') {
          index++
        } else if (character === '`') {
          frames.pop()
          expressionStart = false
        } else if (character === '$' && next === '{') {
          frames.push({ context: 'code', depth: 1 })
          expressionStart = true
          index++
        }
        continue scan
    }
  }
  return frames.at(-1)!.context === 'code'
}
