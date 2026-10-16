import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const getPreference = jest.fn<(key: string) => Promise<unknown>>()
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ RendererWorker: { getPreference, invoke } }))
const Preferences = await import('../src/parts/Preferences/Preferences.ts')
const { getEditorPreferences } = await import('../src/parts/GetEditorPreferences/GetEditorPreferences.ts')

test('uses the application for every normalized editor preference and retains the legacy route', async () => {
  invoke.mockImplementation(async (_method, applicationId, _command, key) => {
    if (key === 'editor.fontSize') return applicationId === 'preview' ? 18 : 15
    if (key === 'breadcrumbs.enabled') return applicationId === 'preview'
    return undefined
  })
  expect(await getEditorPreferences('preview')).toMatchObject({ breadcrumbsEnabled: true, fontSize: 18, rowHeight: 18 })
  expect(await getEditorPreferences('source')).toMatchObject({ breadcrumbsEnabled: false, fontSize: 15, rowHeight: 15 })
  expect(getPreference).not.toHaveBeenCalled()
  expect(
    invoke.mock.calls.every(
      ([method, id, command]) => method === 'Application.execute' && ['preview', 'source'].includes(String(id)) && command === 'Preferences.get',
    ),
  ).toBe(true)
  getPreference.mockResolvedValue(14)
  expect(await Preferences.get('editor.fontSize')).toBe(14)
  expect(getPreference).toHaveBeenCalledWith('editor.fontSize')
})

test('propagates application read failures without reading global preferences', async () => {
  getPreference.mockClear()
  invoke.mockRejectedValue(new Error('Application not found'))
  await expect(getEditorPreferences('closed')).rejects.toThrow('Application not found')
  expect(getPreference).not.toHaveBeenCalled()
})
