import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

const renderedDoms = new Map<number, readonly VirtualDomNode[]>()

export const get = (uid: number): readonly VirtualDomNode[] | undefined => {
  return renderedDoms.get(uid)
}

export const set = (uid: number, dom: readonly VirtualDomNode[]): void => {
  renderedDoms.set(uid, dom)
}

export const clear = (): void => {
  renderedDoms.clear()
}
