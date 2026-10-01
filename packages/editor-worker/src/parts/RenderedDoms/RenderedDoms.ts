import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'

const renderedDoms = new Map<number, readonly VirtualDomNode[]>()
const textAppendPaths = new Map<
  number,
  { readonly cursorIndex: number; readonly cursorPath: readonly number[]; readonly textIndex: number; readonly textPath: readonly number[] }
>()

export const get = (uid: number): readonly VirtualDomNode[] | undefined => {
  return renderedDoms.get(uid)
}

export const set = (
  uid: number,
  dom: readonly VirtualDomNode[],
  paths?: { readonly cursorIndex: number; readonly cursorPath: readonly number[]; readonly textIndex: number; readonly textPath: readonly number[] },
): void => {
  renderedDoms.set(uid, dom)
  setTextAppendPaths(uid, paths)
}

export const getTextAppendPaths = (uid: number) => {
  return textAppendPaths.get(uid)
}

export const setTextAppendPaths = (
  uid: number,
  paths:
    | { readonly cursorIndex: number; readonly cursorPath: readonly number[]; readonly textIndex: number; readonly textPath: readonly number[] }
    | undefined,
): void => {
  if (paths) {
    textAppendPaths.set(uid, paths)
  } else {
    textAppendPaths.delete(uid)
  }
}

export const clear = (): void => {
  renderedDoms.clear()
  textAppendPaths.clear()
}

export const dispose = (uid: number): void => {
  renderedDoms.delete(uid)
  textAppendPaths.delete(uid)
}
