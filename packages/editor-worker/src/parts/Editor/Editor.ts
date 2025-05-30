import * as ApplyWidgetChanges from '../ApplyWidgetChanges/ApplyWidgetChanges.ts'
import * as Assert from '../Assert/Assert.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as EditorStates from '../Editors/Editors.ts'
import * as EditorScrolling from '../EditorScrolling/EditorScrolling.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorSelection from './EditorSelection.ts'

// TODO
export const setDeltaYFixedValue = (editor: any, value: any) => {
  return EditorScrolling.setDeltaY(editor, value)
}

export const setDeltaY = (editor: any, value: any) => {
  return setDeltaYFixedValue(editor, editor.deltaY + value)
}

const isAutoClosingChange = (change: any) => {
  return change.origin === EditOrigin.EditorTypeWithAutoClosing
}

const applyAutoClosingRangesEdit = (editor: any, changes: any[]) => {
  const { autoClosingRanges = [] } = editor
  const newAutoClosingRanges: any[] = []
  const change = changes[0]
  const changeStartRowIndex = change.start.rowIndex
  const changeStartColumnIndex = change.start.columnIndex
  const changeEndRowIndex = change.end.rowIndex
  const changeEndColumnIndex = change.end.columnIndex
  for (let i = 0; i < autoClosingRanges.length; i += 4) {
    const autoStartRowIndex = autoClosingRanges[i]
    const autoStartColumnIndex = autoClosingRanges[i + 1]
    const autoEndRowIndex = autoClosingRanges[i + 2]
    const autoEndColumnIndex = autoClosingRanges[i + 3]
    if (changeEndRowIndex === autoEndRowIndex && changeEndColumnIndex === autoEndColumnIndex) {
      const delta = change.inserted[0].length - change.deleted[0].length
      newAutoClosingRanges.push(autoStartRowIndex, autoStartColumnIndex, autoEndRowIndex, autoEndColumnIndex + delta)
    } else if (
      changeStartRowIndex === autoStartRowIndex &&
      changeStartColumnIndex >= autoStartColumnIndex &&
      changeEndRowIndex === autoEndRowIndex &&
      changeEndColumnIndex <= autoEndColumnIndex
    ) {
      const delta = change.inserted[0].length - change.deleted[0].length
      newAutoClosingRanges.push(autoStartRowIndex, autoStartColumnIndex, autoEndRowIndex, autoEndColumnIndex + delta)
    } else {
      // ignore
    }
  }
  if (isAutoClosingChange(change)) {
    newAutoClosingRanges.push(changeStartRowIndex, changeStartColumnIndex + 1, changeEndRowIndex, changeEndColumnIndex + 1)
  }
  return newAutoClosingRanges
}

export const scheduleSelections = (editor: any, selectionEdits: any) => {
  return EditorSelection.setSelections(editor, selectionEdits)
}

/**
 * TODO make this synchronous maybe?
 * @param {any} editor
 * @param {any[]} changes
 * @param {Uint32Array|undefined} selectionChanges
 * @returns
 */
export const scheduleDocumentAndCursorsSelections = async (editor: any, changes: any, selectionChanges: any = undefined) => {
  Assert.object(editor)
  Assert.array(changes)
  if (changes.length === 0) {
    return editor
  }
  const newLines = TextDocument.applyEdits(editor, changes)
  const partialNewEditor = {
    ...editor,
    lines: newLines,
  }
  const newSelections = selectionChanges || EditorSelection.applyEdit(partialNewEditor, changes)
  // TODO should separate rendering from business logic somehow
  // currently hard to test because need to mock editor height, top, left,
  // invalidStartIndex, lineCache, etc. just for testing editorType
  const invalidStartIndex = Math.min(editor.invalidStartIndex, changes[0].start.rowIndex)

  // TODO maybe put undostack into indexeddb so that there is no memory leak in application
  // then clear old undostack from indexeddb after 3 days
  // TODO should push to undostack after rendering
  const autoClosingRanges = applyAutoClosingRangesEdit(editor, changes)

  const newEditor = {
    ...partialNewEditor,
    lines: newLines,
    selections: newSelections,
    undoStack: [...editor.undoStack, changes],
    invalidStartIndex,
    autoClosingRanges,
  }
  EditorStates.set(editor.uid, editor, newEditor)
  const newWidgets = await ApplyWidgetChanges.applyWidgetChanges(newEditor, changes)
  const newEditor2 = {
    ...newEditor,
    widgets: newWidgets,
  }
  return newEditor2
}
// @ts-ignore
export const scheduleDocumentAndCursorsSelectionIsUndo = (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  if (changes.length === 0) {
    return editor
  }
  const newLines = TextDocument.applyEdits(editor, changes)
  const partialNewEditor = {
    ...editor,
    lines: newLines,
  }
  const newSelections = EditorSelection.applyEdit(partialNewEditor, changes)
  const invalidStartIndex = Math.min(editor.invalidStartIndex, changes[0].start.rowIndex)
  const newEditor = {
    ...partialNewEditor,
    lines: newLines,
    selections: newSelections,
    // undoStack: [...editor.undoStack.slice(0, -2)],
    invalidStartIndex,
  }
  return newEditor
}

// @ts-ignore
export const scheduleDocument = async (editor, changes) => {
  const newLines = TextDocument.applyEdits(editor, changes)
  const invalidStartIndex = changes[0].start.rowIndex
  // if (editor.undoStack) {
  //   editor.undoStack.push(changes)
  // }
  // const cursorInfos = EditorCursor.getVisible(editor)
  // const selectionInfos = EditorSelection.getVisible(editor)
  // const textInfos = EditorText.getVisible(editor)
  // TODO scrollbar calculation duplicate code
  // const scrollBarY =
  //   (editor.deltaY / editor.finalDeltaY) *
  //   (editor.height - editor.scrollBarHeight)
  // const scrollBarHeight = editor.scrollBarHeight

  const newEditor = {
    ...editor,
    undoStack: [...editor.undoStack, changes],
    lines: newLines,
    invalidStartIndex,
  }
  // TODO change event should be emitted after rendering
  return newEditor
  // RendererProcess.send([
  //   /* Viewlet.invoke */ 'Viewlet.send',
  //   /* id */ 'EditorText',
  //   /* method */ 'renderTextAndCursorsAndSelections',
  //   /* deltaY */ scrollBarY,
  //   /* scrollBarHeight */ scrollBarHeight,
  //   /* textInfos */ textInfos,
  //   /* cursorInfos */ cursorInfos,
  //   /* selectionInfos */ selectionInfos,
  // ])
}

export const hasSelection = (editor: any) => {
  // TODO editor.selections should always be defined
  return editor.selections && editor.selections.length > 0
}

export const setBounds = (editor: any, x: number, y: number, width: number, height: number, columnWidth: number) => {
  const { itemHeight } = editor
  const numberOfVisibleLines = Math.floor(height / itemHeight)
  const total = editor.lines.length
  const maxLineY = Math.min(numberOfVisibleLines, total)
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  return {
    ...editor,
    x,
    y,
    width,
    height,
    columnWidth,
    numberOfVisibleLines,
    maxLineY,
    finalY,
    finalDeltaY,
  }
}

export const setText = (editor: any, text: string) => {
  const lines = SplitLines.splitLines(text)
  const { itemHeight, numberOfVisibleLines, minimumSliderSize } = editor
  const total = lines.length
  const maxLineY = Math.min(numberOfVisibleLines, total)
  const finalY = Math.max(total - numberOfVisibleLines, 0)
  const finalDeltaY = finalY * itemHeight
  const contentHeight = lines.length * editor.rowHeight
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(editor.height, contentHeight, minimumSliderSize)
  return {
    ...editor,
    lines,
    maxLineY,
    finalY,
    finalDeltaY,
    scrollBarHeight,
  }
}
