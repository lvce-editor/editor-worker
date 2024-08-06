import * as Assert from '../Assert/Assert.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const getSelectionFromChange = (change: any) => {
  const { start, inserted } = change
  const startRowIndex = start.rowIndex
  const startColumnIndex = start.columnIndex
  const insertedLength = inserted.length
  if (insertedLength === 1) {
    const newPosition = {
      rowIndex: startRowIndex + insertedLength - 1,
      columnIndex: inserted.at(-1).length + startColumnIndex,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const newPosition = {
    rowIndex: startRowIndex + insertedLength - 1,
    columnIndex: startColumnIndex,
  }
  return {
    start: newPosition,
    end: newPosition,
  }
}

export const setSelections = (editor: any, selections: any) => {
  Assert.object(editor)
  // Assert.uint32array(selections)
  return {
    ...editor,
    selections,
  }
  // editor.selections = selections
  // GlobalEventBus.emitEvent('editor.selectionChange', editor, selections)
}

// TODO maybe only accept sorted selection edits in the first place

// TODO avoid allocating too many objects when creating new selection from changes
// @ts-ignore
export const applyEdit = (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  const newSelections = EditorSelection.from(changes, getSelectionFromChange)
  // setSelections(editor, newSelections)
  return newSelections
}
