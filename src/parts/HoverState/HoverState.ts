export interface HoverState {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly uid: number
  readonly content: string
  readonly editorUid: number
  readonly lineInfos: (readonly string[])[]
  readonly documentation: string
  readonly diagnostics: any[]
}
