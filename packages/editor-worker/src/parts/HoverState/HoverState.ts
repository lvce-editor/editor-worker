import type { Rectangle } from '../Rectangle/Rectangle.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

export interface HoverState extends Rectangle {
  readonly commands: readonly VirtualDomNode[]
  readonly content: string
  readonly diagnostics: any[]
  readonly documentation: string
  readonly documentationVirtualDom: readonly VirtualDomNode[]
  readonly editorUid: number
  readonly lineInfos: Array<readonly string[]>
  readonly uid: number
}
