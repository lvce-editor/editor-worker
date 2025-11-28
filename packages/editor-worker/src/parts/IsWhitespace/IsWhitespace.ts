const whitespace = [' ', '\t']

export const isWhitespace = (text: string): boolean => {
  return whitespace.includes(text)
}
