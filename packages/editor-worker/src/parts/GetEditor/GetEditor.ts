import * as Editors from '../EditorStates/EditorStates.ts'

export const getEditor = (editorUid: number) => {
  const instance = Editors.get(editorUid)
  if (!instance) {
    throw new Error(`editor ${editorUid} not found`)
  }
  const { newState } = instance
  return newState
}
