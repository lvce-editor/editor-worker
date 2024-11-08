import type { Edit } from '../Edit/Edit.ts'
import * as Editor from '../Editor/Editor.ts'
import * as GetLineComment from '../GetLineComment/GetLineComment.ts'
import * as GetLineCommentEdit from '../GetLineCommentEdit/GetLineCommentEdit.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const editorToggleLineComment = async (editor: any): Promise<readonly Edit[]> => {
  const lineComment = await GetLineComment.getLineComment(editor)
  if (!lineComment) {
    return editor
  }
  const textDocument = editor
  const cursorRowIndex = editor.selections[0]
  const line = TextDocument.getLine(textDocument, cursorRowIndex)
  const documentEdits = [GetLineCommentEdit.getLineCommentEdit(cursorRowIndex, line, lineComment)]
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
