export interface SignatureHelpParameter {
  readonly documentation?: string
  readonly label: string
}

export interface SignatureHelpSignature {
  readonly documentation?: string
  readonly label: string
  readonly parameters: readonly SignatureHelpParameter[]
}

export interface SignatureHelpResult {
  readonly activeParameter: number
  readonly activeSignature: number
  readonly signatures: readonly SignatureHelpSignature[]
}
