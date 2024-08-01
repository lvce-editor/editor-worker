export const getText = (editor: any) => {
  const { lines } = editor
  return lines.join('\n')
}
