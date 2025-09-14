export interface State {
  readonly uri: string
  readonly languageId: string
  readonly lines: readonly string[]
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly minLineY: number
  readonly maxLineY: number
  readonly deltaX: number
  readonly deltaY: number
  readonly uid: number
  readonly undoStack: readonly any[]
  // TODO should be immutable
  differences: any[]
  readonly debugEnabled: boolean
  readonly highlightedLine: number
  readonly tokenizerId: any
  readonly decorations: any
  readonly embeds: any
  readonly scrollBarHeight: number
  readonly finalDeltaY: number
  readonly longestLineWidth: number
  readonly minimumSliderSize: number
  readonly focused: boolean
  readonly lineNumbers: boolean
  readonly incrementalEdits: readonly any[]
  readonly textInfos: readonly any[]
}
