import * as Editor from '../Editor/Editor.ts'
import * as GetBlockComment from '../GetBlockComment/GetBlockComment.ts'
import * as GetBlockCommentEdits from '../GetBlockCommentEdits/GetBlockCommentEdits.ts'
import * as GetLineComment from '../GetLineComment/GetLineComment.ts'
import { getSelectedLineCommentEdits } from '../GetSelectedLineCommentEdits/GetSelectedLineCommentEdits.ts'
import { getOffsetAtCursor } from '../GetOffsetAtCursor/GetOffsetAtCursor.ts'

export const toggleBlockComment = async (editor: any): Promise<any> => {
  const offset = getOffsetAtCursor(editor)
  const blockComment = await GetBlockComment.getBlockComment(editor, offset)
  if (!blockComment) {
    const lineComment = await GetLineComment.getLineComment(editor)
    if (!lineComment) {
      return editor
    }
    return Editor.scheduleDocumentAndCursorsSelections(editor, getSelectedLineCommentEdits(editor, lineComment))
  }
  const edits = GetBlockCommentEdits.getBlockCommentEdits(editor, blockComment)
  return Editor.scheduleDocument(editor, edits)
}
