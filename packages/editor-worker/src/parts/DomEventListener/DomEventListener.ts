export interface DomEventListener {
  readonly name: number
  readonly params: readonly string[]

  readonly passive?: boolean
  // TODO maybe use flags enum for options
  readonly preventDefault?: boolean
  readonly trackPointerEvents?: readonly number[]
}
