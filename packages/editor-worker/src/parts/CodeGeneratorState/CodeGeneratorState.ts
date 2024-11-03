export interface CodeGeneratorState {
  readonly questions: readonly string[]
  readonly uid: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly focusSource: number
  readonly focused: boolean
}
