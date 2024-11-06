export interface Diagnostic {
  readonly code: number
  readonly rowIndex: number
  readonly columnIndex: number
  readonly endRowIndex: number
  readonly endColumnIndex: number
  readonly message: string
  readonly source: string
  readonly type: string
  readonly uri: string
}
