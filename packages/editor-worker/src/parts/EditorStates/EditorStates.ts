import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { EditorState } from '../State/State.ts'

const editorStates = ViewletRegistry.create<EditorState>()

export const { diff, dispose, getCommandIds, registerCommands, wrapCommand, wrapGetter } = editorStates

export const get = (id: number): ViewletRegistry.StateTuple<EditorState> => {
  return editorStates.get(id)
}

export const getKeys = (): readonly string[] => {
  const keys = editorStates.getKeys()
  return keys.map(String)
}

export const set = (id: number, oldEditor: EditorState, newEditor: EditorState): void => {
  editorStates.set(id, oldEditor, newEditor)
}
