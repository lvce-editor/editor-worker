import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { getFingerprint } from '../src/parts/TokenizerFingerprint/TokenizerFingerprint.ts'

const fetchSource = jest.fn<typeof fetch>()
const sources = new Map<string, string>()
beforeEach(() => {
  sources.clear()
  fetchSource.mockClear()
  jest.spyOn(globalThis, 'fetch').mockImplementation(fetchSource)
  Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: 'https://example.test/app/' } })
  fetchSource.mockImplementation(async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    return new Response(sources.get(url) || '', { status: sources.has(url) ? 200 : 404 })
  })
})
afterEach(() => {
  jest.restoreAllMocks()
})

test('changes to main source, transitive helpers and embedded tokenizers change the fingerprint', async () => {
  sources.set('https://example.test/html.js', "export { tokenizeLine } from './helper.js'")
  sources.set('https://example.test/helper.js', 'export const tokenizeLine = () => 1')
  sources.set('https://example.test/js.js', 'export const tokenizeLine = () => 2')
  const paths = ['/html.js', '/js.js']
  const original = await getFingerprint(paths)
  expect(await getFingerprint(paths.toReversed())).toBe(original)
  sources.set('https://example.test/helper.js', 'export const tokenizeLine = () => 3')
  const changedHelper = await getFingerprint(paths)
  expect(changedHelper).not.toBe(original)
  sources.set('https://example.test/js.js', 'export const tokenizeLine = () => 4')
  expect(await getFingerprint(paths)).not.toBe(changedHelper)
  sources.set('https://example.test/html.js', "export { tokenizeLine } from './helper.js'; export const version = 2")
  expect(await getFingerprint(paths)).not.toBe(original)
})

test('cycles, escaped import specifiers and literal dynamic imports are handled', async () => {
  sources.set('https://example.test/a.js', "export const load = () => import('./b.js')")
  sources.set('https://example.test/b.js', "import './a.js'; export const x = 1")
  expect(await getFingerprint(['/a.js'])).toMatch(/^[a-f0-9]{64}$/)
})

test('unavailable sources, unknown dynamic dependencies, import maps and resource imports are rejected', async () => {
  await expect(getFingerprint(['/missing.js'])).rejects.toThrow()
  for (const source of ['import(name)', 'import(`./${name}.js`)', "import 'mapped-package'", 'console.log(import.meta.url)']) {
    sources.set('https://example.test/a.js', source)
    await expect(getFingerprint(['/a.js'])).rejects.toThrow()
  }
})

test('application-scheme graphs use the renderer reader and include imported helper changes', async () => {
  Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: 'lvce-oss://-/worker.js' } })
  const files = new Map([
    ['lvce-oss://-/tokenize.js', "export { tokenizeLine } from './helper.js'"],
    ['lvce-oss://-/helper.js', 'export const tokenizeLine = () => 1'],
  ])
  const reader = jest.fn(async (url: string) => {
    const source = files.get(url)
    if (source === undefined) throw new Error('Missing source')
    return source
  })
  const original = await getFingerprint(['/tokenize.js'], reader)
  files.set('lvce-oss://-/helper.js', 'export const tokenizeLine = () => 2')
  expect(await getFingerprint(['/tokenize.js'], reader)).not.toBe(original)
  expect(reader).toHaveBeenCalledWith('lvce-oss://-/helper.js')
  expect(fetchSource).not.toHaveBeenCalled()
  await expect(getFingerprint(['/tokenize.js'])).rejects.toThrow('No application source reader')
})
