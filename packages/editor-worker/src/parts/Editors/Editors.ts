import * as Assert from '../Assert/Assert.ts'

interface EditorTuple {
  readonly newState: any
  readonly oldState: any
}

const editors: Record<number, EditorTuple> = Object.create(null)

export const get = (id: number): EditorTuple => {
  Assert.number(id)
  return editors[id]
}

export const getKeys = (): readonly string[] => {
  return Object.keys(editors)
}

export const set = (id: number, oldEditor: any, newEditor: any): void => {
  Assert.object(oldEditor)
  Assert.object(newEditor)
  editors[id] = {
    newState: newEditor,
    oldState: oldEditor,
  }
}
