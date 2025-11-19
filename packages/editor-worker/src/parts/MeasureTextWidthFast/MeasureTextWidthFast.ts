export const measureTextWidthFast = async (text: string, charWidth: number): Promise<number> => {
  return text.length * charWidth
}
