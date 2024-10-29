import * as FocusKey from '../FocusKey/FocusKey.ts'

export const handleBlur = (editor: any): any => {
  if (editor.focusKey !== FocusKey.Empty) {
    return editor
  }
  const newEditor = {
    ...editor,
    focused: false,
    focusKey: FocusKey.Empty,
  }
  return newEditor
}
