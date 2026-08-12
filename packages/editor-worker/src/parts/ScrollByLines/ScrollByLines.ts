import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import type { EditorState } from '../State/State.ts'

export const scrollByLines = (editor: EditorState, lineCount: number): Promise<EditorState> => {
  Assert.number(lineCount)
  return Editor.setDeltaY(editor, lineCount * editor.itemHeight)
}
