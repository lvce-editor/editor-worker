import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'
import * as HandleMouseDown from './EditorCommandHandleMouseDown.ts'

export const handlePointerDown = (state: any, button: number, altKey: boolean, ctrlKey: boolean, x: number, y: number, detail: number) => {
  EditorSelectionAutoMoveState.startSelecting()
  return HandleMouseDown.handleMouseDown(state, button, altKey, ctrlKey, x, y, detail)
}
