export interface EditorStatus {
  readonly column: number
  readonly encoding: string
  readonly endOfLine: string
  readonly insertSpaces: boolean
  readonly languageId: string
  readonly line: number
  readonly tabSize: number
}
