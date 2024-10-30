import type { FindWidgetButton } from '../FindWidgetButton/FindWidgetButton.ts'

export interface FindWidgetButtons {
  readonly findButtons: readonly FindWidgetButton[]
  readonly replaceButtons: readonly FindWidgetButton[]
}
