import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetLineComment from '../GetLineComment/GetLineComment.ts'
import { getSelectedLineCommentEdits } from '../GetSelectedLineCommentEdits/GetSelectedLineCommentEdits.ts'

export const editorToggleLineComment = async (editor: any): Promise<any> => {
  const lineComment = await GetLineComment.getLineComment(editor)
  if (!lineComment) {
    return editor
  }
  const documentEdits = getSelectedLineCommentEdits(editor, lineComment, EditOrigin.LineComment)
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
