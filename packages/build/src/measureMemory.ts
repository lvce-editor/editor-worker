import { measureMemory } from '@lvce-editor/measure-memory'
import { minifiedWorkerPath, playwrightPath, threshold, workerPath } from './config.ts'
import { minifyJs } from './minifyJs.ts'

process.stdout.write('Measuring bundled worker memory\n')
await measureMemory({
  playwrightPath,
  threshold,
  workerPath,
})

await minifyJs(workerPath, minifiedWorkerPath)

process.stdout.write('Measuring minified worker memory\n')
await measureMemory({
  playwrightPath,
  threshold,
  workerPath: minifiedWorkerPath,
})
