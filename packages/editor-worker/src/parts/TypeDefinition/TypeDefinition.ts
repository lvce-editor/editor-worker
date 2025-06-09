import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getTypeDefinition = async (editor: any, offset: number) => {
  // @ts-ignore
  const definition = await RendererWorker.invoke('ExtensionHostTypeDefinition.executeTypeDefinitionProvider', editor, offset)
  return definition
}
