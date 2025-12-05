import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

const combineResults = (results: any) => {
  return results[0] ?? []
}

export const executeRenameProvider = async (editor: any, offset: number, newName: string) => {
  return ExtensionHostEditor.execute({
    args: [offset, newName],
    combineResults,
    editor,
    event: ExtensionHostActivationEvent.OnRename,
    method: ExtensionHostCommandType.RenameExecuteRename,
    noProviderFoundMessage: 'no rename provider found',
    noProviderFoundResult: [],
  })
}
