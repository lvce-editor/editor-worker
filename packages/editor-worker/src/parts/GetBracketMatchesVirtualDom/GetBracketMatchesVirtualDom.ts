import type { BracketMatchInfo } from '../BracketMatchInfo/BracketMatchInfo.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getBracketMatchesVirtualDom = (infos: readonly BracketMatchInfo[]): readonly VirtualDomNode[] => {
  return infos.map(({ height, width, x, y }) => ({
    childCount: 0,
    className: 'BracketMatch',
    height,
    left: x,
    top: y,
    type: VirtualDomElements.Div,
    width,
  }))
}
