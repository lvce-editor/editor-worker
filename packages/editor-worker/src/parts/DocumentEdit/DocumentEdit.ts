export interface DocumentEdit {
  readonly start: any
  readonly end: any
  readonly inserted: readonly string[]
  readonly deleted: readonly string[]
  readonly origin: string | number
}
