import express from 'express'
import { join } from 'node:path'

export const createApp = (textSearchWorkerPath: string, root: string) => {
  const app = express()

  // Serve worker file
  app.get('/dist/textSearchWorkerMain.js', (req, res) => {
    res.sendFile(textSearchWorkerPath)
  })

  // Serve index.html from root directory
  app.get('/', (req, res) => {
    res.sendFile(join(root, 'index.html'))
  })

  return app
}
