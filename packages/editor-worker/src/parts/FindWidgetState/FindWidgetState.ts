export interface FindWidgetState {
  readonly disposed?: boolean // TODO make field required
  readonly editorUid: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly commands: readonly any[]
  readonly uid: number
}
