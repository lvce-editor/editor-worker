import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as Editors from '../Editors/Editors.ts'
import * as Editors from '../Editors/Editors.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as GetWordAtOffset from '../GetWordAtOffset/GetWordAtOffset.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}

export const getWordAt = (editorUid: number, rowIndex: number, columnIndex: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const { word } = EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
  return word
}

export const getWordAtOffset2 = (editorUid: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const word = GetWordAtOffset.getWordAtOffset(editor)
  return word
}

export const getWordBefore2 = (editorUid: number, rowIndex: number, columnIndex: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  const word = EditorCommandGetWordAt.getWordBefore(editor, rowIndex, columnIndex)
  return word
}

export const getLines2 = (editorUid: number): readonly string[] => {
  const editor = GetEditor.getEditor(editorUid)
  const { lines } = editor
  return lines
}

export const getSelections2 = (editorUid: number): readonly string[] => {
  const editor = GetEditor.getEditor(editorUid)
  const { selections } = editor
  return selections
}

export const closeFind2 = async (editorUid: number) => {
  // console.log('close find')
  const editor = GetEditor.getEditor(editorUid)
  const { widgets } = editor
  const index = widgets.findIndex((widget: any) => widget.id === WidgetId.Find)
  if (index === -1) {
    return
  }
  const findWidget = widgets[index]
  await FindWidgetWorker.invoke('FindWidget.dispose', findWidget.newState.uid)
  const newWidgets = [...widgets.slice(0, index), ...widgets.slice(index + 1)]
  // TODO transfer focus to editor
  const newEditor = {
    ...editor,
    widgets: newWidgets,
    focused: true,
  }
  Editors.set(editorUid, editor, newEditor)
  // console.log('before rerender')
  // await RendererWorker.invoke('Editor.rerender', editorUid)
  // console.log('after rerender')
}
