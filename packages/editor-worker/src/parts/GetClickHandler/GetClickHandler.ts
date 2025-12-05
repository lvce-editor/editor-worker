import { closeWidgetsMaybe } from '../CloseWidgetsMaybe/CloseWidgetsMaybe.ts'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'
import * as HandleSingleClickWithAlt from '../HandleSingleClickWithAlt/HandleSingleClickWithAlt.ts'
import * as HandleSingleClickWithCtrl from '../HandleSingleClickWithCtrl/HandleSingleClickWithCtrl.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'

const handleSingleClickDefault = (editor: any, position: any) => {
  // TODO avoid global variables, add them to editor state
  EditorMoveSelectionAnchorState.setPosition(position)
  const widgets = closeWidgetsMaybe(editor.widgets)
  return {
    ...editor,
    focused: true,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    widgets,
  }
}

export const getClickHandler = (modifier: any) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return HandleSingleClickWithAlt.handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return HandleSingleClickWithCtrl.handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}
