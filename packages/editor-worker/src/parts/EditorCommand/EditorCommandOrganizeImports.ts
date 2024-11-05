import * as GetOrganizeImportEdits from '../GetOrganizeImportEdits/GetOrganizeImportEdits.ts'
import * as ApplyDocumentEdits from './EditorCommandApplyDocumentEdits.ts'

export const organizeImports = async (editor: any): Promise<any> => {
  const edits = await GetOrganizeImportEdits.getOrganizeImportEdits(editor)
  console.log({ editor, edits })
  return ApplyDocumentEdits.applyDocumentEdits(editor, edits)
}
