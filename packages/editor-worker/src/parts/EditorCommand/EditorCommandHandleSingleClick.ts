import * as Assert from '../Assert/Assert.ts'
import * as EditorMoveSelectionAnchorState from '../EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'
import * as HandleSingleClickWithAlt from '../HandleSingleClickWithAlt/HandleSingleClickWithAlt.ts'
import * as HandleSingleClickWithCtrl from '../HandleSingleClickWithCtrl/HandleSingleClickWithCtrl.ts'
import * as ModifierKey from '../ModifierKey/ModifierKey.ts'
import * as EditorPosition from './EditorCommandPosition.ts'


const handleSingleClickDefault = (editor: any, position: any) => {
  EditorMoveSelectionAnchorState.setPosition(position)
  return {
    ...editor,
    selections: new Uint32Array([position.rowIndex, position.columnIndex, position.rowIndex, position.columnIndex]),
    focused: true,
  }
}

const getFn = (modifier: any) => {
  switch (modifier) {
    case ModifierKey.Alt:
      return HandleSingleClickWithAlt.  handleSingleClickWithAlt
    case ModifierKey.Ctrl:
      return HandleSingleClickWithCtrl. handleSingleClickWithCtrl
    default:
      return handleSingleClickDefault
  }
}

export const handleSingleClick = async (editor: any, modifier: any, x: number, y: number) => {
  Assert.object(editor)
  Assert.number(modifier)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  const fn = getFn(modifier)
  const newEditor = await fn(editor, position)
  // switch (newEditor.completionState) {
  //   case EditorCompletionState.None:
  //   case EditorCompletionState.Visible:
  //   case EditorCompletionState.Loading:
  //     return {
  //       newState: newEditor,
  //       commands: [],
  //     }
  //   default:
  //     break
  // }
  return newEditor
}
