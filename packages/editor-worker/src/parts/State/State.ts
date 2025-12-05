export interface State {
  readonly additionalFocus: number
  readonly debugEnabled: boolean
  readonly decorations: any
  readonly deltaX: number
  readonly deltaY: number
  // TODO should be immutable
  differences: any[]
  readonly embeds: any
  readonly finalDeltaY: number
  readonly focus: number
  readonly focused: boolean
  readonly height: number
  readonly highlightedLine: number
  readonly incrementalEdits: readonly any[]
  readonly languageId: string
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly longestLineWidth: number
  readonly maxLineY: number
  readonly minimumSliderSize: number
  readonly minLineY: number
  readonly scrollBarHeight: number
  readonly textInfos: readonly any[]
  readonly tokenizerId: any
  readonly uid: number
  readonly undoStack: readonly any[]
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}
