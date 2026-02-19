import type { EditorState } from '../State/State.ts'

export interface Renderer {
  (oldState: EditorState, newState: EditorState): readonly any[]
}
