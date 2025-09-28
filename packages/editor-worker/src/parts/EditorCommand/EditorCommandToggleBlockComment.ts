import * as Editor from '../Editor/Editor.ts'
import * as GetBlockComment from '../GetBlockComment/GetBlockComment.ts'
import * as GetBlockCommentEdits from '../GetBlockCommentEdits/GetBlockCommentEdits.ts'
import { getOffsetAtCursor } from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

export const toggleBlockComment = async (editor: any): Promise<any> => {
  const offset = getOffsetAtCursor(editor)
  const blockComment = await GetBlockComment.getBlockComment(editor, offset)
  if (!blockComment) {
    return editor
  }
  const edits = GetBlockCommentEdits.getBlockCommentEdits(editor, blockComment)
  return Editor.scheduleDocument(editor, edits)
}
