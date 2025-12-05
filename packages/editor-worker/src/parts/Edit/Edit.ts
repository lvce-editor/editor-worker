export interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

export interface Edit {
  readonly deleted: readonly string[]
  readonly end: Position
  readonly inserted: readonly string[]
  readonly origin: string
  readonly start: Position
}
