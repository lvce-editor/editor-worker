import type { RenameState } from '../RenameState/RenameState.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getRenameVirtualDom = (state: RenameState): readonly any[] => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorRename',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox RenameInputBox',
      value: state.newValue,
      childCount: 0,
      onBlur: 'handleBlur',
    },
  ]
}
