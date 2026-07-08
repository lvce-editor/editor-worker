import type { EditorState } from '../State/State.ts'

export const handlePointerDown = async (
  state: EditorState,
  button: number,
  altKey: boolean,
  ctrlKey: boolean,
  x: number,
  y: number,
  detail: number,
): Promise<EditorState> => {
  return state
}
