import type { EndOfLine } from '../EndOfLine/EndOfLine.ts'
import * as EndOfLineType from '../EndOfLine/EndOfLine.ts'

export const normalizeLineEndings = (content: string): string => {
  return content.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
}

export const applyLineEndings = (content: string, endOfLine: EndOfLine): string => {
  return endOfLine === EndOfLineType.Crlf ? normalizeLineEndings(content).replaceAll('\n', '\r\n') : normalizeLineEndings(content)
}
