import { MenuEntryId, MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as HelpStrings from '../HelpStrings/HelpStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getMenuEntries = (): readonly MenuEntry[] => {
  return [
    {
      id: 'go-to-definition',
      label: EditorStrings.goToDefinition(),
      flags: MenuItemFlags.None,
      command: 'Editor.goToDefinition',
    },
    {
      id: 'go-to-type-definition',
      label: EditorStrings.goToTypeDefinition(),
      flags: MenuItemFlags.None,
      command: /* Editor.goToTypeDefinition */ 'Editor.goToTypeDefinition',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'find-all-references',
      label: EditorStrings.findAllReferences(),
      flags: MenuItemFlags.None,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'References', /* focus */ true],
    },
    {
      id: 'find-all-implementations',
      label: EditorStrings.findAllImplementations(),
      flags: MenuItemFlags.None,
      command: /* ViewletSideBar.show */ 'SideBar.show',
      args: [/* id */ 'Implementations', /* focus */ true],
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'format',
      label: EditorStrings.formatDocument(),
      flags: MenuItemFlags.None,
      command: 'Editor.format',
    },
    {
      id: MenuEntryId.SourceControl,
      label: EditorStrings.sourceAction(),
      flags: MenuItemFlags.None,
      command: 'Editor.showSourceActions2',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'cut',
      label: EditorStrings.cut(),
      flags: MenuItemFlags.None,
      command: /* Editor.cut */ 'Editor.cut',
    },
    {
      id: 'copy',
      label: EditorStrings.copy(),
      flags: MenuItemFlags.None,
      command: /* Editor.copy */ 'Editor.copy',
    },
    {
      id: 'paste',
      label: EditorStrings.paste(),
      flags: MenuItemFlags.None,
      command: /* Editor.paste */ 'Editor.paste',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'commandPalette',
      label: HelpStrings.commandPalette(),
      flags: MenuItemFlags.None,
      command: 'QuickPick.showEverything',
    },
  ]
}
