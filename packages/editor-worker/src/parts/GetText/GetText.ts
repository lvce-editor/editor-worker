import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

export const getText = (editorUid: number) => {
  Assert.number(editorUid)
  const editor = GetEditor.getEditor(editorUid)
  const { lines } = editor
  return lines.join(Character.NewLine)
}
