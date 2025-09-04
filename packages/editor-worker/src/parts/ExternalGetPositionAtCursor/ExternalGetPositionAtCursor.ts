import { WidgetId } from '@lvce-editor/constants'
import * as ApplyEdit from '../EditorCommand/EditorCommandApplyEdit.ts'
import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as Editors from '../Editors/Editors.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetOffsetAtCursor from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import { getEditorSourceActions } from '../GetSourceActions/GetSourceActions.ts'
import { getWidgetInvoke } from '../GetWidgetInvoke/GetWidgetInvoke.ts'
import * as GetWordAtOffset from '../GetWordAtOffset/GetWordAtOffset.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}

export const getUri = (editorUid: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  return editor.uri
}

export const getLanguageId = (editorUid: number): string => {
  const editor = GetEditor.getEditor(editorUid)
  return editor.languageId
}

export const getOffsetAtCursor = (editorUid: number): number => {
  const editor = GetEditor.getEditor(editorUid)
  return GetOffsetAtCursor.getOffsetAtCursor(editor)
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

export const setSelections2 = (editorUid: number, selections: Uint32Array): void => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = { ...editor, selections }
  Editors.set(editorUid, editor, newEditor)
}

export const closeWidget2 = async (editorUid: number, widgetId: number, widgetName: string, unsetAdditionalFocus: number) => {
  const editor = GetEditor.getEditor(editorUid)
  const invoke = getWidgetInvoke(widgetId)
  const { widgets } = editor
  const index = widgets.findIndex((widget: any) => widget.id === widgetId)
  if (index === -1) {
    return
  }
  await invoke(`${widgetName}.dispose`)
  const newWidgets = [...widgets.slice(0, index), ...widgets.slice(index + 1)]
  const newEditor = {
    ...editor,
    widgets: newWidgets,
    focused: true,
  }
  Editors.set(editorUid, editor, newEditor)
  await SetFocus.setFocus(WhenExpression.FocusEditorText)
  if (unsetAdditionalFocus) {
    await SetFocus.unsetAdditionalFocus(unsetAdditionalFocus)
  }
}

export const closeFind2 = async (editorUid: number) => {
  await closeWidget2(editorUid, WidgetId.Find, 'FindWidget', 0)
}

export const applyEdits2 = async (editorUid: number, edits: readonly any[]): Promise<void> => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = await ApplyEdit.applyEdit(editor, edits)
  Editors.set(editorUid, editor, newEditor)
}

export const getSourceActions = async (editorUid: number): Promise<readonly any[]> => {
  const actions = await getEditorSourceActions(editorUid)
  return actions
}
