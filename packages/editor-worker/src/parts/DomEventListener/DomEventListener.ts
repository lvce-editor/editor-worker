export interface DomEventListener {
  readonly name: string
  readonly params: readonly string[]

  readonly passive?: boolean
  // TODO maybe use flags enum for options
  readonly preventDefault?: boolean
}
