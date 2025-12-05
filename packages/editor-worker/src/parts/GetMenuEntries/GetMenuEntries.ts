import { MenuEntryId, MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as HelpStrings from '../HelpStrings/HelpStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getMenuEntries = (): readonly MenuEntry[] => {
  return [
    {
      command: 'Editor.goToDefinition',
      flags: MenuItemFlags.None,
      id: 'go-to-definition',
      label: EditorStrings.goToDefinition(),
    },
    {
      command: /* Editor.goToTypeDefinition */ 'Editor.goToTypeDefinition',
      flags: MenuItemFlags.None,
      id: 'go-to-type-definition',
      label: EditorStrings.goToTypeDefinition(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [/* id */ 'References', /* focus */ true],
      command: /* ViewletSideBar.show */ 'SideBar.show',
      flags: MenuItemFlags.None,
      id: 'find-all-references',
      label: EditorStrings.findAllReferences(),
    },
    {
      args: [/* id */ 'Implementations', /* focus */ true],
      command: /* ViewletSideBar.show */ 'SideBar.show',
      flags: MenuItemFlags.None,
      id: 'find-all-implementations',
      label: EditorStrings.findAllImplementations(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'Editor.format',
      flags: MenuItemFlags.None,
      id: 'format',
      label: EditorStrings.formatDocument(),
    },
    {
      command: 'Editor.showSourceActions2',
      flags: MenuItemFlags.None,
      id: MenuEntryId.SourceControl,
      label: EditorStrings.sourceAction(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: /* Editor.cut */ 'Editor.cut',
      flags: MenuItemFlags.None,
      id: 'cut',
      label: EditorStrings.cut(),
    },
    {
      command: /* Editor.copy */ 'Editor.copy',
      flags: MenuItemFlags.None,
      id: 'copy',
      label: EditorStrings.copy(),
    },
    {
      command: /* Editor.paste */ 'Editor.paste',
      flags: MenuItemFlags.None,
      id: 'paste',
      label: EditorStrings.paste(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'QuickPick.showEverything',
      flags: MenuItemFlags.None,
      id: 'commandPalette',
      label: HelpStrings.commandPalette(),
    },
  ]
}
