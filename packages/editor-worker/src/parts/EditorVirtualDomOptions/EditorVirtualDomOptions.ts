export interface EditorVirtualDomOptions {
  readonly cursorInfos: readonly any[]
  readonly diagnostics: readonly any[]
  readonly differences: readonly number[]
  readonly gutterInfos: readonly any[]
  readonly highlightedLine: number
  readonly lineNumbers: boolean
  readonly scrollBarDiagnostics: readonly any[]
  readonly selectionInfos: readonly any[]
  readonly textInfos: readonly any[]
}
