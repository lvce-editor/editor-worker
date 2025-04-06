import * as Assert from '../Assert/Assert.ts'
import * as GetClickHandler from '../GetClickHandler/GetClickHandler.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

export const handleSingleClick = async (editor: any, modifier: any, x: number, y: number) => {
  Assert.object(editor)
  Assert.number(modifier)
  Assert.number(x)
  Assert.number(y)
  const position = EditorPosition.at(editor, x, y)
  const fn = GetClickHandler.getClickHandler(modifier)
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
