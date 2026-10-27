import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as Px from '../Px/Px.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

interface CachedRow {
  readonly className: string
  readonly difference: number
  readonly dom: readonly VirtualDomNode[]
  readonly tokens: readonly string[]
}

const rows = new WeakMap<readonly string[], CachedRow>()

const sameTokens = (left: readonly string[], right: readonly string[]): boolean => {
  if (left.length !== right.length) {
    return false
  }
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) {
      return false
    }
  }
  return true
}

export const getCachedEditorRowVirtualDom = (tokens: readonly string[], difference: number, className: string): readonly VirtualDomNode[] => {
  const cached = rows.get(tokens)
  if (cached && cached.difference === difference && cached.className === className && sameTokens(cached.tokens, tokens)) {
    return cached.dom
  }
  const children: VirtualDomNode[] = []
  for (let index = 0; index < tokens.length; index += 2) {
    if (tokens[index].length > 0) {
      children.push({ childCount: 1, className: tokens[index + 1], type: VirtualDomElements.Span }, text(tokens[index]))
    }
  }
  const dom = [
    {
      childCount: children.length / 2,
      className,
      translate: difference === 0 ? '' : Px.px(difference),
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
  // Snapshot token values: callers can replace tokens in the same array.
  rows.set(tokens, { className, difference, dom, tokens: [...tokens] })
  return dom
}
