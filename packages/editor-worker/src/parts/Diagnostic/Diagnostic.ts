export const DiagnosticTag = {
  Deprecated: 2,
  Unnecessary: 1,
} as const

export interface Diagnostic {
  readonly code: number
  readonly columnIndex: number
  readonly endColumnIndex: number
  readonly endRowIndex: number
  readonly message: string
  readonly rowIndex: number
  readonly source: string
  readonly tags?: readonly number[]
  readonly type: string
  readonly uri: string
}
