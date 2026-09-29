const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

await WebWorkerRpcClient.create({
  commandMap: {
    'ExtensionApi.executeHoverProvider'() {
      return {
        displayString: 'signature',
        documentation: 'Read the [API guide](https://example.com/api).\n\n```ts\nconst answer = 42\nconsole.log(answer)\n```',
      }
    },
    'ExtensionApi.getHoverProviderRegistrySnapshot'() {
      return { providers: [{ id: 'editor-hover-markdown', languageId: 'xyz' }] }
    },
  },
})
