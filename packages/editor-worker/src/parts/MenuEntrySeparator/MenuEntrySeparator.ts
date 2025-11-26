import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'

export const menuEntrySeparator: MenuEntry = {
  id: 'separator',
  label: '',
  flags: MenuItemFlags.Separator,
  command: '',
}
