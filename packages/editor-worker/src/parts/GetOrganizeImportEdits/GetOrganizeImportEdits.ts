import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

export const getOrganizeImportEdits = async (editor: any) => {
  const edits = await ExtensionHostEditor.execute({
    editor,
    event: 'onLanguage',
    method: 'ExtensionHostOrganizeImports.execute',
    args: [],
  })
  return edits
}
