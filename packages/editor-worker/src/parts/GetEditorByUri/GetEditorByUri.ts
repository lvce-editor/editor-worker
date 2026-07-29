import type { EditorState } from '../State/State.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const getEditorByUri = (uri: string, excludedUid: number): EditorState | undefined => {
  for (const key of EditorStates.getKeys()) {
    const uid = Number(key)
    if (uid === excludedUid) {
      continue
    }
    const editor = EditorStates.get(uid)?.newState
    if (editor && !editor.initial && editor.uri === uri) {
      return editor
    }
  }
  return undefined
}
