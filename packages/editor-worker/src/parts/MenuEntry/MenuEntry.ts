export interface MenuEntry {
  readonly id: string | number
  readonly label: string
  readonly flags: number
  readonly command: string
  readonly args?: readonly any[]
}
