import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export const handleContextMenu = async (editor: any, button: any, x: number, y: number) => {
  await RendererWorker.showContextMenu(/* x */ x, /* y */ y, /* id */ MenuEntryId.Editor)
  return editor
}
