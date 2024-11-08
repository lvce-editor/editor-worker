import * as Editor from '../Editor/Editor.ts'
import * as GetBlockComment from '../GetBlockComment/GetBlockComment.ts'
import * as GetBlockCommentEdits from '../GetBlockCommentEdits/GetBlockCommentEdits.ts'

export const toggleBlockComment = async (editor: any): Promise<any> => {
  const blockComment = await GetBlockComment.getBlockComment(editor)
  if (!blockComment) {
    return editor
  }
  const edits = GetBlockCommentEdits.getBlockCommentEdits(editor, blockComment)
  return Editor.scheduleDocument(editor, edits)
}
