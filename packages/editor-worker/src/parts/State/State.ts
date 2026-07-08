export interface EditorState {
  readonly additionalFocus: number
  readonly assetDir: string
  readonly charWidth: number
  readonly columnWidth: number
  readonly completionsOnType?: boolean
  readonly completionState: string
  readonly completionTriggerCharacters: readonly string[]
  readonly completionUid: number
  readonly cursorInfos: readonly any[]
  readonly cursorWidth: number
  readonly debugEnabled: boolean
  readonly decorations: any // Text-level decorations (flat array) for CSS classes like Link, Type, etc.
  readonly deltaX: number
  readonly deltaY: number
  readonly diagnostics: readonly any[]
  readonly diagnosticsEnabled: boolean
  // TODO should be immutable
  differences: any[]
  readonly embeds: any
  readonly finalDeltaY: number
  readonly finalY: number
  readonly focus: number
  readonly focused: boolean
  readonly focusKey: number
  readonly fontFamily: string
  readonly fontSize: number
  readonly fontWeight: number
  readonly handleOffset: number
  readonly handleOffsetX: number
  readonly hasListener: boolean
  readonly height: number
  readonly highlightedLine: number
  readonly id: number
  readonly incrementalEdits: readonly any[]
  readonly initial: boolean
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
  readonly lineCache: readonly any[]
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly loadError?: string
  readonly longestLineWidth: number
  readonly maxLineY: number
  readonly minimumSliderSize: number
  readonly minLineY: number
  readonly modified: boolean
  readonly numberOfLines: number
  readonly numberOfVisibleLines: number
  readonly platform: number
  readonly primarySelectionIndex: number
  readonly redoStack: readonly any[]
  readonly rowHeight: number
  readonly savedSelections: readonly any[]
  readonly scrollBarHeight: number
  readonly scrollBarWidth: number
  readonly scrollBarY?: number
  readonly selectionAnchorPosition: { readonly rowIndex: number; readonly columnIndex: number }
  readonly selectionAutoMovePosition: { readonly rowIndex: number; readonly columnIndex: number }
  readonly selectionInfos: readonly any[]
  readonly selections: Uint32Array
  readonly tabSize: number
  readonly textInfos: readonly any[]
  readonly tokenizerId: any
  readonly uid: number
  readonly undoStack: readonly any[]
  readonly uri: string
  readonly useFunctionalRendering?: boolean
  readonly validLines: readonly number[]
  readonly visualDecorations?: any // Visual decorations (objects) for diagnostic squiggly underlines
  readonly widgets: readonly any[]
  readonly width: number
  readonly x: number
  readonly y: number
}
