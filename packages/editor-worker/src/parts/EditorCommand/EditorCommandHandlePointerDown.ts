import type { EditorState } from '../State/State.ts'

export const handlePointerDown = async (
  state: EditorState,
  button: number,
  altKey: boolean,
  ctrlKey: boolean,
  x: number,
  y: number,
  detail: number,
  gutterWidth: number = state.gutterWidth ?? 0,
): Promise<EditorState> => {
  const currentGutterWidth = state.gutterWidth ?? 0
  if (currentGutterWidth === gutterWidth) {
    return state
  }
  return {
    ...state,
    gutterWidth,
  }
}
