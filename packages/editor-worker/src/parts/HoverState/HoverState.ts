import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface HoverState extends Rectangle {
  readonly uid: number
  readonly content: string
  readonly editorUid: number
  readonly lineInfos: (readonly string[])[]
  readonly documentation: string
  readonly diagnostics: any[]
}
