import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

export const executeRenameProvider = async (editor: any, offset: number, newName: string) => {
  return ExtensionManagementEditor.execute({
    args: [offset, newName],
    editor,
    kind: 'rename',
    method: 'provideRename',
    noProviderFoundResult: [],
  })
}
