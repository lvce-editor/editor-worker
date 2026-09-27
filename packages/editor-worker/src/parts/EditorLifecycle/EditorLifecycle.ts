export interface EditorLifecycle {
  disposed: boolean
  sentLines?: readonly string[]
}

export const create = (): EditorLifecycle => ({ disposed: false })
