import { Server } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './createApp.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

export const startServer = async (port: number, textSearchWorkerPath: string): Promise<Server> => {
  const app = createApp(textSearchWorkerPath, root)

  const { promise, resolve } = Promise.withResolvers<void>()
  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    resolve()
  })
  await promise
  return server
}
