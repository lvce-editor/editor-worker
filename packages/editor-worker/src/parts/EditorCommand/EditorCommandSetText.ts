import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'

export const setText = (editor: any, text: string) => {
  Assert.string(text)
  return Editor.setText(editor, text)
}
