import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

const getSelectionFromChange = (change: any) => {
  const { inserted, start } = change
  const startRowIndex = start.rowIndex
  const startColumnIndex = start.columnIndex
  const insertedLength = inserted.length
  if (insertedLength === 1) {
    const newPosition = {
      columnIndex: inserted.at(-1).length + startColumnIndex,
      rowIndex: startRowIndex + insertedLength - 1,
    }
    return {
      end: newPosition,
      start: newPosition,
    }
  }
  const newPosition = {
    columnIndex: startColumnIndex,
    rowIndex: startRowIndex + insertedLength - 1,
  }
  return {
    end: newPosition,
    start: newPosition,
  }
}

export const setSelections = (editor: any, selections: any) => {
  Assert.object(editor)
  const newEditor = {
    ...editor,
    selections,
  }
  const { maxLineY, minLineY, numberOfVisibleLines } = editor
  if (maxLineY === undefined || minLineY === undefined || numberOfVisibleLines <= 0) {
    return newEditor
  }
  const rowIndex = selections[editor.primarySelectionIndex || 0]
  if (rowIndex === undefined) {
    return newEditor
  }
  if (rowIndex >= minLineY && rowIndex < maxLineY) {
    return newEditor
  }
  const { finalDeltaY, height, itemHeight, lines, scrollBarHeight } = editor
  const desiredMinLineY = rowIndex < minLineY ? rowIndex : rowIndex - numberOfVisibleLines + 1
  const deltaY = Clamp.clamp(desiredMinLineY * itemHeight, 0, finalDeltaY)
  const newMinLineY = Math.floor(deltaY / itemHeight)
  const newMaxLineY = Math.min(newMinLineY + numberOfVisibleLines, lines.length)
  const scrollBarY = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  return {
    ...newEditor,
    deltaY,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
    scrollBarY,
  }
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
