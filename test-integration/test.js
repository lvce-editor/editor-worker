import { createWorker } from './createWorker.js'

const workerPath = new URL('../dist/dist/editorWorkerMain.js', import.meta.url).toString()

const main = async () => {
  const rpc = await createWorker(workerPath)
  const syntaxHighlightingEnabled = true
  const syncIncremental = true
  await rpc.invoke('Initialize.initialize', syntaxHighlightingEnabled, syncIncremental)
  console.log('finish initializing')
}

main()
