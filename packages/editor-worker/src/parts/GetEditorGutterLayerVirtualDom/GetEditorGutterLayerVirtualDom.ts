import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorGutterVirtualDom = (gutterInfos: readonly any[], activeLineNumber = -1): readonly VirtualDomNode[] => {
  const gutterDom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom([...gutterInfos], activeLineNumber)
  return [
    {
      childCount: gutterInfos.length === 0 ? 0 : 1,
      className: 'Gutter',
      type: VirtualDomElements.Div,
    },
    ...gutterDom,
  ]
}
