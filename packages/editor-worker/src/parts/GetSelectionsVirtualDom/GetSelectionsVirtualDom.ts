import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getSelectionCornerClasses } from '../GetSelectionCornerClasses/GetSelectionCornerClasses.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getSelectionsVirtualDom = (selections: any, focused = true, roundedSelection = false): readonly VirtualDomNode[] => {
  const corners = roundedSelection
    ? getSelectionCornerClasses(selections.map((value: string | number) => (typeof value === 'number' ? value : Number(value.replace(/px$/, '')))))
    : []
  const dom: VirtualDomNode[] = []
  const className = focused ? ClassNames.EditorSelection : ClassNames.SelectionUnfocused
  for (let i = 0; i < selections.length; i += 4) {
    const x = selections[i]
    const y = selections[i + 1]
    const width = selections[i + 2]
    const height = selections[i + 3]
    dom.push({
      childCount: 0,
      className: className + (corners[i / 4] || ''),
      height,
      left: x,
      top: y,
      type: VirtualDomElements.Div,
      width,
    })
  }
  return dom
}
