import * as MoveLines from '../MoveLines/MoveLines.ts'

export const moveLineUp = (editor: any) => {
  return MoveLines.moveLines(editor, -1)
}
