import * as DecorationType from '../DecorationType/DecorationType.ts'

const stride = 4

const isRenameDecoration = (decorations: readonly number[], index: number): boolean => {
  return decorations[index + 2] === DecorationType.Rename
}

export const clear = (editor: any): any => {
  const { decorations } = editor
  const filtered: number[] = []
  for (let i = 0; i < decorations.length; i += stride) {
    if (!isRenameDecoration(decorations, i)) {
      filtered.push(decorations[i], decorations[i + 1], decorations[i + 2], decorations[i + 3])
    }
  }
  if (filtered.length === decorations.length) {
    return editor
  }
  return {
    ...editor,
    decorations: filtered,
  }
}

export const set = (editor: any, offset: number, length: number): any => {
  const editorWithoutRenameDecoration = clear(editor)
  return {
    ...editorWithoutRenameDecoration,
    decorations: [...editorWithoutRenameDecoration.decorations, offset, length, DecorationType.Rename, 0],
  }
}
