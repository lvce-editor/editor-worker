import * as ChangeSelectedValue from '../ChangeSelectedValue/ChangeSelectedValue.ts'

export const decrementSelection = (editor: any): Promise<any> => {
  return ChangeSelectedValue.changeSelectedValue(editor, -1)
}

export const incrementSelection = (editor: any): Promise<any> => {
  return ChangeSelectedValue.changeSelectedValue(editor, 1)
}
