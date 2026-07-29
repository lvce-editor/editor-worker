import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const editorMessageNode: VirtualDomNode = {
  childCount: 2,
  className: MergeClassNames.mergeClassNames('Viewlet', 'EditorMessage'),
  tabIndex: -1,
  type: VirtualDomElements.Div,
}

const editorMessageTextNode: VirtualDomNode = {
  childCount: 1,
  className: 'EditorMessageText',
  type: VirtualDomElements.Div,
}

const editorMessageTriangleNode: VirtualDomNode = {
  childCount: 0,
  className: 'EditorMessageTriangle',
  type: VirtualDomElements.Div,
}

export const getEditorMessageVirtualDom = (message: string): readonly VirtualDomNode[] => {
  const dom: readonly VirtualDomNode[] = [editorMessageNode, editorMessageTextNode, text(message), editorMessageTriangleNode]
  return dom
}
