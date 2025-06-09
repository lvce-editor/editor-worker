import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// @ts-ignore
export const getDefinition = async (editor, offset) => {
  // @ts-ignore
  const definition = await RendererWorker.invoke('ExtensionHostDefinition.executeDefinitionProvider', editor, offset)
  return definition
}
