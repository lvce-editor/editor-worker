import * as Editors from '../EditorStates/EditorStates.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as UpdateDerivedState from '../UpdateDerivedState/UpdateDerivedState.ts'
import * as UpdateColorPickerValue from '../UpdateColorPickerValue/UpdateColorPickerValue.ts'

export const updateColorPickerValue = async (editorUid: number, value: string): Promise<void> => {
  const editor = GetEditor.getEditor(editorUid)
  const newEditor = await UpdateColorPickerValue.updateColorPickerValue(editor, value)
  if (newEditor === editor) {
    return
  }
  const newEditorWithDerivedState = await UpdateDerivedState.updateDerivedState(editor, newEditor)
  Editors.set(editorUid, editor, newEditorWithDerivedState)
}
