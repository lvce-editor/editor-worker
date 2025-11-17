import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getLanguageConfiguration = async (editor: any) => {
  // @ts-ignore
  return RendererWorker.invoke('Languages.getLanguageConfiguration', {
    uri: editor.uri,
    languageId: editor.languageId,
  })
}
