export interface Widget<T> {
  readonly id: number | string
  readonly oldState: T
  readonly newState: T
}
