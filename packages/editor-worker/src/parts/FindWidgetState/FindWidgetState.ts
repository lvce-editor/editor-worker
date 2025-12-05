export interface FindWidgetState {
  readonly commands: readonly any[]
  readonly disposed?: boolean // TODO make field required
  readonly editorUid: number
  readonly height: number
  readonly uid: number
  readonly width: number
  readonly x: number
  readonly y: number
}
