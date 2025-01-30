export interface DomEventListener {
  readonly name: string
  readonly params: readonly string[]

  // TODO maybe use flags enum for options
  readonly preventDefault?: boolean
  readonly passive?: boolean
}
