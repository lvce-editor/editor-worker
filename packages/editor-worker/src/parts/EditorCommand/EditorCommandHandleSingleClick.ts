import * as Assert from '../Assert/Assert.ts'
import { handleClickAtPosition } from './EditorCommandHandleClickAtPosition.ts'
import * as EditorPosition from './EditorCommandPosition.ts'

export const handleSingleClick = async (editor: any, modifier: any, x: number, y: number) => {
  Assert.object(editor)
  Assert.number(modifier)
  Assert.number(x)
  Assert.number(y)
  const position = await EditorPosition.at(editor, x, y)
  return handleClickAtPosition(editor, modifier, position.rowIndex, position.columnIndex)
}
