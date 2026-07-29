import type { SignatureHelpResult } from '../SignatureHelpResult/SignatureHelpResult.ts'
import * as ExtensionHostSignatureHelp from '../ExtensionHostSignatureHelp/ExtensionHostSignatureHelp.ts'

export const getSignatureHelp = async (editor: any, offset: number): Promise<SignatureHelpResult | undefined> => {
  return ExtensionHostSignatureHelp.executeSignatureHelpProvider(editor, offset)
}
