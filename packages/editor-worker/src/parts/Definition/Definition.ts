import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

// @ts-ignore
export const getDefinition = async (editor, offset) => {
  return ExtensionManagementEditor.execute({
    args: [offset],
    editor,
    kind: 'definition',
    method: 'provideDefinition',
  })
}
