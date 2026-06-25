import * as HandleMouseDown from './EditorCommandHandleMouseDown.ts'

export const handlePointerDown = async (state: any, button: number, altKey: boolean, ctrlKey: boolean, x: number, y: number, detail: number) => {
  const newState = await HandleMouseDown.handleMouseDown(state, button, altKey, ctrlKey, x, y, detail)
  return {
    ...newState,
    isSelecting: true,
  }
}
