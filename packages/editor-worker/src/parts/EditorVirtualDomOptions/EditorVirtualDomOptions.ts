import type { DocumentSymbol } from '../DocumentSymbol/DocumentSymbol.ts'
import type { EditorGutterDecoration } from '../EditorGutterDecoration/EditorGutterDecoration.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export interface EditorVirtualDomOptions {
  readonly bracketMatchInfos?: readonly any[]
  readonly breadcrumbFileIcon?: string
  readonly breadcrumbsEnabled?: boolean
  readonly breakPoints?: readonly number[]
  readonly combineWhitespaceTokens?: boolean
  readonly cursorInfos?: readonly any[]
  readonly deltaY?: number
  readonly diagnostics?: readonly any[]
  readonly differences: readonly number[]
  readonly documentSymbols?: readonly DocumentSymbol[]
  readonly endOfLineDecorations?: readonly { readonly rowIndex: number; readonly text: string }[]
  readonly finalDeltaY?: number
  readonly focused?: boolean
  readonly gutterDecorations?: readonly EditorGutterDecoration[]
  readonly gutterInfos?: readonly any[]
  readonly height?: number
  readonly highlightActiveLineNumber?: boolean
  readonly highlightedLine?: number
  readonly horizontalVisibleRanges?: readonly {
    readonly end: number
    readonly rowIndex: number
    readonly segments?: readonly number[]
    readonly start: number
  }[]
  readonly lightBulbRowIndex?: number
  readonly lineNumbers?: boolean
  readonly lines?: readonly string[]
  readonly loadError?: string
  readonly maxLineY?: number
  readonly minimapEnabled?: boolean
  readonly minimapLines?: readonly (readonly (number | string)[])[]
  readonly minLineY?: number
  readonly primarySelectionIndex?: number
  readonly problemsHighlightedRow?: number
  readonly roundedSelection?: boolean
  readonly rtl?: boolean
  readonly scrollBarDiagnostics?: readonly any[]
  readonly scrollBarHeight?: number
  readonly scrollBarWidth?: number
  readonly selectionInfos?: readonly any[]
  readonly selections?: any
  readonly tabSize?: number
  readonly textDecorationDom?: readonly VirtualDomNode[]
  readonly textInfos: readonly any[]
  readonly uid: number
  readonly unnecessaryDiagnostics?: readonly any[]
  readonly uri?: string
  readonly visibleLineIndices?: readonly number[]
  readonly visibleViewLineIndices?: readonly number[]
  readonly workspaceUri?: string
}
