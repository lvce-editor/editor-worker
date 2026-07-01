import * as Clipboard from '../ClipBoard/ClipBoard.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.ts'

export const cutLine = async (editor: any) => {
  const { lines, selections } = editor
  const seenRows = new Set<number>()
  const rows: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (!seenRows.has(startRowIndex)) {
      seenRows.add(startRowIndex)
      rows.push(startRowIndex)
    }
  }
  const replaceRange = new Uint32Array(rows.length * 4)
  const selectionChanges = new Uint32Array(rows.length * 4)
  const cutLines: string[] = []
  for (let i = 0; i < rows.length; i++) {
    const startRowIndex = rows[i]
    const line = lines[startRowIndex]
    const offset = i * 4
    replaceRange[offset] = startRowIndex
    replaceRange[offset + 1] = 0
    replaceRange[offset + 2] = startRowIndex
    replaceRange[offset + 3] = line.length
    selectionChanges[offset] = startRowIndex
    selectionChanges[offset + 1] = 0
    selectionChanges[offset + 2] = startRowIndex
    selectionChanges[offset + 3] = 0
    cutLines.push(line)
  }
  const changes = EditorCommandReplaceRange.replaceRange(editor, replaceRange, [''], EditOrigin.EditorCut)
  await Clipboard.writeText(JoinLines.joinLines(cutLines))
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
