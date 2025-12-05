import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface CompletionDetailState extends Rectangle {
  readonly borderSize: number
  readonly content: string
  readonly uid: number
}
