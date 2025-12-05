import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface HoverState extends Rectangle {
  readonly commands: readonly any[]
  readonly content: string
  readonly diagnostics: any[]
  readonly documentation: string
  readonly editorUid: number
  readonly lineInfos: Array<readonly string[]>
  readonly uid: number
}
