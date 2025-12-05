import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const text = (data: string) => {
  return {
    childCount: 0,
    text: data,
    type: VirtualDomElements.Text,
  }
}
