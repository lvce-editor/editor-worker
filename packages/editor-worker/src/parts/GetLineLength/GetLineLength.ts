export const getLineLength = (line: string): number => {
  return line.endsWith('\r') ? line.length - 1 : line.length
}
