import type { DocumentSymbol } from '../DocumentSymbol/DocumentSymbol.ts'
import * as ExtensionManagementEditor from '../ExtensionManagementEditor/ExtensionManagementEditor.ts'

export const getDocumentSymbols = async (editor: any): Promise<readonly DocumentSymbol[]> => {
  try {
    const result = await ExtensionManagementEditor.execute({
      args: [],
      editor,
      kind: 'document symbol',
      method: 'provideDocumentSymbols',
      noProviderFoundResult: [],
    })
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}
