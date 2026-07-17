import * as Editor from '../Editor/Editor.ts'

export const setSelections = (editor: any, selections: any) => {
  return Editor.scheduleSelections(editor, selections)
}
