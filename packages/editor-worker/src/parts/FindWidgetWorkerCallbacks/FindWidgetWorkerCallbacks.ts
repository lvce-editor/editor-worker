import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as ApplyDocumentEdits from '../EditorCommand/EditorCommandApplyDocumentEdits.ts'
import * as EditorCommandCloseFind from '../EditorCommand/EditorCommandCloseFind.ts'
import * as Editors from '../EditorStates/EditorStates.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

const updateEditor = async (editorUid: number, editor: any, newEditor: any): Promise<void> => {
  if (newEditor === editor) {
    return
  }
  const newEditorWithDerivedState = await UpdateDerivedState.updateDerivedState(editor, newEditor)
  Editors.set(editorUid, editor, newEditorWithDerivedState)
}

export const applyDocumentEdits = async (editorUid: number, edits: readonly OffsetBasedEdit[]): Promise<void> => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = await ApplyDocumentEdits.applyDocumentEdits(editor, edits)
  await updateEditor(editorUid, editor, newEditor)
}

export const closeFind = async (editorUid: number): Promise<void> => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = EditorCommandCloseFind.closeFind(editor)
  await updateEditor(editorUid, editor, newEditor)
  await SetFocus.setFocus(WhenExpression.FocusEditorText)
}

export const getLines = (editorUid: number): readonly string[] => {
  return GetEditor.getEditor(editorUid).lines
}

export const getSelections = (editorUid: number): Uint32Array => {
  return GetEditor.getEditor(editorUid).selections
}

export const setSelections = async (editorUid: number, selections: Uint32Array): Promise<void> => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = {
    ...editor,
    selections,
  }
  await updateEditor(editorUid, editor, newEditor)
}
