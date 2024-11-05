import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

export const getFormattingEdits = async (editor: any): Promise<readonly any[]> => {
  const edits = await ExtensionHostEditor.execute({
    editor,
    event: 'onFormatting',
    method: 'ExtensionHostFormatting.executeFormattingProvider',
    args: [],
  })
  return edits
}
