import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

export const getTypeDefinition = async (editor: any, offset: number) => {
  return ExtensionManagementEditor.execute({
    args: [offset],
    editor,
    kind: 'type definition',
    method: 'provideTypeDefinition',
  })
}
