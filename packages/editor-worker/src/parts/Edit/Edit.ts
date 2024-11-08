export interface Position {
  readonly rowIndex: number
  readonly columnIndex: number
}

export interface Edit {
  readonly inserted: readonly string[]
  readonly deleted: readonly string[]
  readonly start: Position
  readonly end: Position
  readonly origin: string
}
