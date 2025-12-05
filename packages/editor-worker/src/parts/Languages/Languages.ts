import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getLanguageConfiguration = async (editor: any) => {
  // @ts-ignore
  return RendererWorker.invoke('Languages.getLanguageConfiguration', {
    languageId: editor.languageId,
    uri: editor.uri,
  })
}
