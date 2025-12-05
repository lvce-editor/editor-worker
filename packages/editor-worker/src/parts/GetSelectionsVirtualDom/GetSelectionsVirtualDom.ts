import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSelectionsVirtualDom = (selections: any): readonly VirtualDomNode[] => {
  const dom = []
  for (let i = 0; i < selections.length; i += 4) {
    const x = selections[i]
    const y = selections[i + 1]
    const width = selections[i + 2]
    const height = selections[i + 3]
    dom.push({
      className: ClassNames.EditorSelection,
      height,
      left: x,
      top: y,
      type: VirtualDomElements.Div,
      width,
    })
  }
  return dom
}
