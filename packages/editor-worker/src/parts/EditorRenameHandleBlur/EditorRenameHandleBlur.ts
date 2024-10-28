import * as EditorCommandCloseRename from '../EditorCommand/EditorCommandCloseRename.ts'

export const handleBlur = (editor: any): any => {
  return EditorCommandCloseRename.closeRename(editor)
}
