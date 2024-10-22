import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface CompletionDetailState extends Rectangle {
  readonly content: string
  readonly uid: number
  readonly borderSize: number
}
