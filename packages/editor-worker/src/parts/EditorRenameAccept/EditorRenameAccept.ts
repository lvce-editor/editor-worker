import * as EditorCommandCloseRename from '../EditorCommand/EditorCommandCloseRename.ts'

export const accept = (editor: any): any => {
  // TODO
  // 1. ask extension host for rename edits
  // 2. apply rename edit across editor (and whole workspace)
  // 3. close rename widget
  return EditorCommandCloseRename.closeRename(editor)
}
