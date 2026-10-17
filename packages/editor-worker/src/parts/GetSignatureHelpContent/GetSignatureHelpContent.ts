import type { SignatureHelpParameter, SignatureHelpResult, SignatureHelpSignature } from '../SignatureHelpResult/SignatureHelpResult.ts'

export interface SignatureHelpContent {
  readonly displayString: string
  readonly documentation: string
}

const clampIndex = (index: number, length: number): number => {
  return Math.max(0, Math.min(index, length - 1))
}

const getDocumentation = (signature: SignatureHelpSignature, parameter: SignatureHelpParameter | undefined, activeParameter: number): string => {
  const documentation: string[] = []
  if (parameter) {
    documentation.push(`Parameter ${activeParameter + 1} of ${signature.parameters.length}: ${parameter.label}`)
    if (parameter.documentation) {
      documentation.push(parameter.documentation)
    }
  }
  if (signature.documentation) {
    documentation.push(signature.documentation)
  }
  return documentation.join('\n')
}

export const getSignatureHelpContent = (signatureHelp: SignatureHelpResult): SignatureHelpContent | undefined => {
  if (signatureHelp.signatures.length === 0) {
    return undefined
  }
  const activeSignature = clampIndex(signatureHelp.activeSignature, signatureHelp.signatures.length)
  const signature = signatureHelp.signatures[activeSignature]
  const activeParameter = clampIndex(signatureHelp.activeParameter, signature.parameters.length)
  const parameter = signature.parameters[activeParameter]
  return {
    displayString: signature.label,
    documentation: getDocumentation(signature, parameter, activeParameter),
  }
}
