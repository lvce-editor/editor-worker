import { WidgetId } from '@lvce-editor/constants'
import * as CoalesceColorPickerUndoStack from '../CoalesceColorPickerUndoStack/CoalesceColorPickerUndoStack.ts'
import * as ColorPickerValue from '../ColorPickerValue/ColorPickerValue.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetDocumentEdits from '../GetDocumentEdits/GetDocumentEdits.ts'

export const updateColorPickerValue = async (editor: any, value: string): Promise<any> => {
  if (typeof value !== 'string') {
    return editor
  }
  const widget = editor.widgets.find((candidate: any) => candidate.id === WidgetId.ColorPicker)
  if (!widget) {
    return editor
  }
  const { endOffset, startOffset, undoStackIndex, value: originalValue } = widget.newState
  if (startOffset < 0 || endOffset < startOffset) {
    return editor
  }
  const editorValue = ColorPickerValue.toEditorValue(value, originalValue)
  const edits = GetDocumentEdits.getDocumentEdits(editor, [{ endOffset, inserted: editorValue, startOffset }]).map((edit) => ({
    ...edit,
    origin: EditOrigin.ColorPicker,
  }))
  const updatedEditor = await Editor.scheduleDocumentAndCursorsSelections(editor, edits)
  const newEndOffset = startOffset + editorValue.length
  const widgets = updatedEditor.widgets.map((candidate: any) => {
    if (candidate.id !== WidgetId.ColorPicker) {
      return candidate
    }
    return {
      ...candidate,
      newState: {
        ...candidate.newState,
        endOffset: newEndOffset,
      },
      oldState: {
        ...candidate.oldState,
        endOffset: newEndOffset,
      },
    }
  })
  return {
    ...updatedEditor,
    undoStack: CoalesceColorPickerUndoStack.coalesceColorPickerUndoStack(updatedEditor.undoStack, undoStackIndex),
    widgets,
  }
}
