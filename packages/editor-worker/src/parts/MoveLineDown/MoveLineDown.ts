import * as MoveLines from '../MoveLines/MoveLines.ts'

export const moveLineDown = (editor: any) => {
  return MoveLines.moveLines(editor, 1)
}
