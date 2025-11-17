import { RendererWorker } from '@lvce-editor/rpc-registry'

// @ts-ignore
export const getDefinition = async (editor, offset) => {
  // @ts-ignore
  const definition = await RendererWorker.invoke('ExtensionHostDefinition.executeDefinitionProvider', editor, offset)
  return definition
}
