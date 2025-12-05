export interface DocumentEdit {
  readonly deleted: readonly string[]
  readonly end: any
  readonly inserted: readonly string[]
  readonly origin: string | number
  readonly start: any
}
