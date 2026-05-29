import * as EditorSelectionAutoMoveState from '../EditorSelectionAutoMoveState/EditorSelectionAutoMoveState.ts'

export const handlePointerUp = (editor: any) => {
  EditorSelectionAutoMoveState.clearEditor()
  return editor
}
