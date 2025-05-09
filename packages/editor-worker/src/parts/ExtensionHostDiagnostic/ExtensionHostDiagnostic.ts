import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

const combineResults = (results: any) => {
  return results[0]
}

export const executeDiagnosticProvider = (editor: any): Promise<readonly Diagnostic[]> => {
  return ExtensionHostEditor.execute({
    editor,
    event: ExtensionHostActivationEvent.OnDiagnostic,
    method: 'ExtensionHost.executeDiagnosticProvider',
    args: [],
    noProviderFoundMessage: 'no diagnostic provider found',
    noProviderResult: [],
    combineResults,
  })
}
