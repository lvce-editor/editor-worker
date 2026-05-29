import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as GetEditorGutterVirtualDom from '../GetEditorGutterVirtualDom/GetEditorGutterVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getEditorGutterVirtualDom = (gutterInfos: readonly any[]): readonly VirtualDomNode[] => {
  const gutterDom = GetEditorGutterVirtualDom.getEditorGutterVirtualDom([...gutterInfos])
  return [
    {
      childCount: gutterInfos.length,
      className: 'Gutter',
      type: VirtualDomElements.Div,
    },
    ...gutterDom,
  ]
}
