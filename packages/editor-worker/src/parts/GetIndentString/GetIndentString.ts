import type { EditorState } from '../State/State.ts'

export const getIndentString = ({ insertSpaces, tabSize }: Pick<EditorState, 'insertSpaces' | 'tabSize'>): string => {
  return (insertSpaces ?? true) ? ' '.repeat(tabSize || 2) : '\t'
}
