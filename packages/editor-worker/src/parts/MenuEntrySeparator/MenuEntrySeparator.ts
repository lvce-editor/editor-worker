import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'

export const menuEntrySeparator: MenuEntry = {
  command: '',
  flags: MenuItemFlags.Separator,
  id: 'separator',
  label: '',
}
