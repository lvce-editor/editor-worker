import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as ExtensionHostEditor from '../ExtensionHostEditor/ExtensionHostEditor.ts'

export const executeHoverProvider = async (editor: any, offset: number) => {
  Assert.object(editor)
  Assert.number(offset)
  return ExtensionHostEditor.execute({
    args: [offset],
    editor,
    event: ExtensionHostActivationEvent.OnHover,
    method: ExtensionHostCommandType.HoverExecute,
    noProviderFoundMessage: 'No hover provider found',
  })
}
