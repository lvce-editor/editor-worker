import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as GetEditorMessageVirtualDom from '../GetEditorMessageVirtualDom/GetEditorMessageVirtualDom.ts'

export const getEmptySourceActionsVirtualDom = () => {
  return GetEditorMessageVirtualDom.getEditorMessageVirtualDom(EditorStrings.noCodeActionsAvailable())
}
