import * as Assert from '../Assert/Assert.ts'
import * as GetClickHandler from '../GetClickHandler/GetClickHandler.ts'

export const handleClickAtPosition = async (editor: any, modifier: any, rowIndex: number, columnIndex: number) => {
  Assert.object(editor)
  Assert.number(modifier)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  const fn = GetClickHandler.getClickHandler(modifier)
  const newEditor = await fn(editor, { rowIndex, columnIndex })
  return newEditor
}
