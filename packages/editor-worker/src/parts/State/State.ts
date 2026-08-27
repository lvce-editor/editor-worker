import type { BracketMatchInfo } from '../BracketMatchInfo/BracketMatchInfo.ts'
import type { DocumentSymbol } from '../DocumentSymbol/DocumentSymbol.ts'
import type { EditorGutterDecoration } from '../EditorGutterDecoration/EditorGutterDecoration.ts'
import type { EditorLineDecoration } from '../EditorLineDecoration/EditorLineDecoration.ts'
import type { EndOfLine } from '../EndOfLine/EndOfLine.ts'
import type { MergeConflict } from '../MergeConflict/MergeConflict.ts'

export interface EditorState {
  readonly additionalFocus: number
  readonly assetDir: string
  readonly bracketMatchInfos: readonly BracketMatchInfo[]
  readonly breadcrumbsEnabled?: boolean
  readonly breakPoints: readonly number[]
  readonly canCoalesceTyping?: boolean
  readonly charWidth: number
  readonly columnWidth: number
  readonly completionsOnType?: boolean
  readonly completionState: string
  readonly completionTriggerCharacters: readonly string[]
  readonly completionUid: number
  readonly cursorInfos: readonly any[]
  readonly cursorUndoStack?: readonly Uint32Array[]
  readonly cursorWidth: number
  readonly debugEnabled: boolean
  readonly decorations: any // Text-level decorations (flat array) for CSS classes like Link, Type, etc.
  readonly deltaX: number
  readonly deltaY: number
  readonly diagnostics: readonly any[]
  readonly diagnosticsEnabled: boolean
  // TODO should be immutable
  differences: any[]
  readonly documentSymbols?: readonly DocumentSymbol[]
  readonly dragAndDropEnabled: boolean
  readonly embeds: any
  readonly endOfLine: EndOfLine
  readonly endOfLineDecorations: readonly EditorLineDecoration[]
  readonly finalDeltaY: number
  readonly finalY: number
  readonly focus: number
  readonly focused: boolean
  readonly focusKey: number
  readonly foldingRanges: readonly { readonly end: number; readonly start: number }[]
  readonly fontFamily: string
  readonly fontSize: number
  readonly fontWeight: number
  readonly gutterDecorations: readonly EditorGutterDecoration[]
  readonly gutterWidth: number
  readonly handleOffset: number
  readonly handleOffsetX: number
  readonly hasListener: boolean
  readonly height: number
  readonly highlightActiveLineNumber: boolean
  readonly highlightedLine: number
  readonly hoverEnabled: boolean
  readonly id: number
  readonly incrementalEdits: readonly any[]
  readonly initial: boolean
  readonly insertSpaces: boolean
  readonly invalidStartIndex: number
  readonly isAutoClosingBracketsEnabled: boolean
  readonly isAutoClosingQuotesEnabled: boolean
  readonly isAutoClosingTagsEnabled: boolean
  readonly isMonospaceFont: boolean
  readonly isQuickSuggestionsEnabled: boolean
  readonly isSelecting: boolean
  readonly itemHeight: number
  readonly languageId: string
  readonly letterSpacing: number
  readonly lightBulbRowIndex: number
  readonly lineCache: readonly any[]
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly loadError?: string
  readonly longestLineWidth: number
  readonly maxLineY: number
  readonly mergeConflictActionsEnabled: boolean
  readonly mergeConflicts: readonly MergeConflict[]
  readonly minimapEnabled: boolean
  readonly minimapLines: readonly (readonly (number | string)[])[]
  readonly minimapRevision: number
  readonly minimumSliderSize: number
  readonly minLineY: number
  readonly modified: boolean
  readonly numberOfLines: number
  readonly numberOfVisibleLines: number
  readonly outerHeight?: number
  readonly outerWidth: number
  readonly platform: number
  readonly primarySelectionIndex: number
  readonly problemNavigationDiagnostic?: any
  readonly redoStack: readonly any[]
  readonly rowHeight: number
  readonly savedSelections: readonly any[]
  readonly scrollBarHeight: number
  readonly scrollBarWidth: number
  readonly scrollBarY?: number
  readonly selectionAnchorPosition: { readonly rowIndex: number; readonly columnIndex: number }
  readonly selectionAutoMovePosition: { readonly x: number; readonly y: number }
  readonly selectionInfos: readonly any[]
  readonly selections: Uint32Array
  readonly tabSize: number
  readonly textDragDropPosition: { readonly rowIndex: number; readonly columnIndex: number }
  readonly textDragId: number
  readonly textInfos: readonly any[]
  readonly tokenizerId: any
  readonly uid: number
  readonly undoStack: readonly any[]
  readonly uri: string
  readonly useFunctionalRendering?: boolean
  readonly validLines: readonly number[]
  readonly viewLineIndices: readonly number[]
  readonly visibleLineIndices: readonly number[]
  readonly visibleViewLineIndices: readonly number[]
  readonly visualDecorations?: any // Visual decorations (objects) for diagnostic squiggly underlines
  readonly widgetRevision: number
  readonly widgets: readonly any[]
  readonly width: number
  readonly workspaceUri?: string
  readonly x: number
  readonly y: number
}
