import * as Editor from '../Editor/Editor.ts'
import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

const getNewSelections = async (editor: any, selections: any) => {
  const newSelections = await ExtensionManagementEditor.execute({
    args: [selections],
    editor,
    kind: 'selection',
    method: 'provideSelections',
    noProviderFoundResult: [],
  })
  if (newSelections.length === 0) {
    return selections
  }
  return new Uint32Array(newSelections)
}

export const selectionGrow = async (editor: any) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
