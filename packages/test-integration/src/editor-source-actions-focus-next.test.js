const id = 0

export const test = async ({ Editor, EditorSourceActions }) => {
  await Editor.create({
    id,
    content: 'a',
    fontFamily: '',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 400,
    letterSpacing: 0.5,
    tabSize: 2,
    width: 100,
    isMonospaceFont: true,
    charWidth: 9,
  })
  await Editor.cursorSet(id, 0, 1)
  await Editor.showSourceActions(id)
  await EditorSourceActions.focusNext(id)
  // TODO test with non-empty array
}
