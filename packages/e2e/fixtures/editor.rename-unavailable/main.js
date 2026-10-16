import { activate as activateExtensionApi, registerRenameProvider } from '@lvce-editor/api'

await activateExtensionApi()

for (const languageId of ['rename-no-prepare', 'rename-rejected', 'rename-undefined']) {
  const provider = {
    id: languageId,
    languageId,
    provideRename() {
      throw new Error('Unavailable rename provider must not be called')
    },
  }
  if (languageId !== 'rename-no-prepare') {
    provider.prepareRename = () => (languageId === 'rename-rejected' ? null : undefined)
  }
  registerRenameProvider(provider)
}
