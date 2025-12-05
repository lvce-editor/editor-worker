export interface Widget<T> {
  readonly id: number | string
  readonly newState: T
  readonly oldState: T
}
