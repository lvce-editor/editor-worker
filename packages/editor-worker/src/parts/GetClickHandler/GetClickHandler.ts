import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'
import * as HandleSingleClickWithAlt from '../HandleSingleClickWithAlt/HandleSingleClickWithAlt.ts'
import * as HandleSingleClickWithCtrl from '../HandleSingleClickWithCtrl/HandleSingleClickWithCtrl.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'


const handleSingleClickDefault = (editor: any, position: any) => {
  EditorMoveSelectionAnchorState.setPosition(position)
  return {
    ...editor,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    focused: true,
  }
}

export const getClickHandler = (modifier: any) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return HandleSingleClickWithAlt.  handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return HandleSingleClickWithCtrl. handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}
