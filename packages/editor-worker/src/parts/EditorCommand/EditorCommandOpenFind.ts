import type { EditorState } from '../State/State.ts'
import * as OpenFind2 from './EditorCommandOpenFind2.ts'

export const openFind = async (state: EditorState): Promise<EditorState> => {
  return OpenFind2.openFind2(state)
}
