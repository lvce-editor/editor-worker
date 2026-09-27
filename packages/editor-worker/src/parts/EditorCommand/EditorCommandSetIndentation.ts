export const setIndentation = (editor: any, insertSpaces: boolean) => {
  if (editor.insertSpaces === insertSpaces) {
    return editor
  }
  return {
    ...editor,
    focused: true,
    insertSpaces,
  }
}
