import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'
import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'

export const getOrganizeImportEdits = async (editor: any): Promise<readonly OffsetBasedEdit[]> => {
  const edits = await ExtensionHostEditor.execute({
    editor,
    event: 'onLanguage',
    method: 'ExtensionHostOrganizeImports.execute',
    args: [],
  })
  return edits
}
