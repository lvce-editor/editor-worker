export interface QuickPickMenuEntry {
  readonly aliases?: readonly string[]
  readonly args?: readonly unknown[]
  readonly id: string
  readonly label: string
}
