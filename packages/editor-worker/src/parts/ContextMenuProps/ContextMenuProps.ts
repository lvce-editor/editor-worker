import type { MenuEntryId } from '@lvce-editor/constants'

export interface ContextMenuPropsBase {
  readonly menuId: number
}

export interface ContextMenuPropsExplorer extends ContextMenuPropsBase {
  readonly menuId: typeof MenuEntryId.ManageExtension
}

export type ContextMenuProps = ContextMenuPropsExplorer
