import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

export const state = {
  isComposing: false,
  compositionText: '',
}

export const compositionStart = (editor: any, event: any) => {
  state.isComposing = true
  return editor
}

const getCompositionChanges = (selections: any, data: any) => {
  const changes: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const startColumnIndex = selectionStartColumn - state.compositionText.length
    changes.push({
      start: {
        rowIndex: selectionStartRow,
        columnIndex: startColumnIndex,
      },
      end: {
        rowIndex: selectionEndRow,
        columnIndex: selectionEndColumn,
      },
      inserted: [data],
      deleted: [state.compositionText],
      origin: EditOrigin.CompositionUpdate,
    })
  }
  return changes
}

export const compositionUpdate = (editor: any, data: any) => {
  const { selections } = editor
  const changes = getCompositionChanges(selections, data)
  state.compositionText = data
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const compositionEnd = (editor: any, data: any) => {
  const { selections } = editor
  const changes = getCompositionChanges(selections, data)
  state.isComposing = false
  state.compositionText = ''
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
