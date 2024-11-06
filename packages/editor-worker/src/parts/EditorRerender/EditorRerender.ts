export const rerender = (editor: any): any => {
  // TODO avoid slow clone
  return structuredClone(editor)
}
