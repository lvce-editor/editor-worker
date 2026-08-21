import * as EndOfLine from '../EndOfLine/EndOfLine.ts'

export const getEndOfLine = (content: string): EndOfLine.EndOfLine => {
  return content.includes('\r\n') ? EndOfLine.Crlf : EndOfLine.Lf
}
