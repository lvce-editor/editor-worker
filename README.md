# Editor Worker

Editor Worker contains the core editing logic for [Lvce Editor](https://github.com/lvce-editor/lvce-editor). It runs as a web worker and keeps the editor's document state, command handling, widget state, and virtual DOM rendering work off the renderer process.

## Features

- Text document editing, selections, cursor movement, clipboard commands, indentation, line movement, sorting, commenting, undo, and redo.
- Virtual DOM generation for editor rows, cursors, selections, gutters, diagnostics, scroll bars, messages, and inline widgets.
- Editor widgets for completions, completion details, hover, find, rename, source actions, color picker, and code generation.
- Extension-host integration for diagnostics, hover, definitions, type definitions, tab completion, source actions, formatting, and tokenizers.
- Incremental rendering, diffing, text measurement, syntax highlighting, link detection, and editor preference handling.
- Unit and end-to-end coverage for editing behavior, widget rendering, extension fixtures, and browser-facing editor flows.

## Repository Layout

```text
.
├── packages/editor-worker   # Worker source, RPC API types, editor modules, and unit tests
├── packages/build           # Build, static export, dependency cache, and memory measurement scripts
├── packages/e2e             # Playwright-based end-to-end tests and fixture extensions
└── packages/server          # Local test server wrapper for development and e2e runs
```

## Requirements

- Node.js `24.16.0` or newer compatible with the version in `.nvmrc`
- npm
- Chromium for Playwright e2e tests

If you use `nvm`, run:

```sh
nvm use
```

## Getting Started

Install dependencies from the repository root:

```sh
npm ci
```

Installation does not modify the installed server assets.

Start a development build and local test server:

```sh
npm run dev
```

This builds the local package, then starts the watch build and the Lvce Editor test server with `packages/e2e` as the test path. The server uses `--link` to load the generated `.tmp/dist` editor-worker package.

## Common Commands

Run these commands from the repository root unless noted otherwise.

| Command                | Description                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run build`        | Bundles the editor worker into `.tmp/dist/dist/editorWorkerMain.js` and prepares a publishable package in `.tmp/dist`. |
| `npm run build:watch`  | Watches `packages/editor-worker/src/editorWorkerMain.ts` and rebuilds the worker with esbuild.                         |
| `npm run build:static` | Exports a static test build into `.tmp/static`. Run `npm run build` first.                                             |
| `npm run dev`          | Runs the watch build and local test server together.                                                                   |
| `npm test`             | Runs package test scripts through npm workspaces.                                                                      |
| `npm run type-check`   | Runs TypeScript project references for all packages.                                                                   |
| `npm run lint`         | Runs ESLint, Prettier checks, and Knip.                                                                                |
| `npm run format`       | Formats the repository with Prettier.                                                                                  |

Package-specific commands:

```sh
cd packages/e2e
npm run e2e:headless
npm run e2e
```

```sh
cd packages/build
npm run measure
npm run measure:visible
```

## Build Output

`npm run build` creates `.tmp/dist`, including:

- `dist/editorWorkerMain.js`, the bundled worker entry point.
- `dist/api/api.d.ts`, copied from the worker RPC API type definition.
- `package.json`, `README.md`, and `LICENSE` for publishing `@lvce-editor/editor-worker`.

Version resolution for release builds comes from, in order:

1. `RG_VERSION`
2. `GIT_TAG`
3. The current exact git tag
4. `0.0.0-dev`

## Worker Entry Points

- Runtime entry: `packages/editor-worker/src/editorWorkerMain.ts`
- Main worker bootstrap: `packages/editor-worker/src/parts/Main/Main.ts`
- Typed RPC surface: `packages/editor-worker/src/parts/Api/Api.ts`

The worker listens for RPC messages, registers widget modules, initializes unhandled error handling, and delegates editor commands through the module structure in `packages/editor-worker/src/parts`.

## Testing

Unit tests live in `packages/editor-worker/test` and are run by the editor-worker package's Jest setup.

End-to-end tests live in `packages/e2e/src` and use fixture extensions from `packages/e2e/fixtures`. Run `npm run build` from the repository root before launching either e2e suite: both server launchers link the local `.tmp/dist` package. Install Chromium if needed:

```sh
cd packages/e2e
npx playwright install chromium
npm run e2e:headless
```

The memory benchmark pins its Playwright version in `packages/build` to keep the browser runtime consistent with the memory limit. E2e tests use the browser version required by the test harness.

## CI and Releases

Pull requests and pushes to `main` run on Ubuntu, macOS, and Windows. CI builds the worker, exports the static test build, runs unit tests, type checks, linting, e2e tests, and memory measurement.

Tagged releases matching `v*.*.*` create a draft GitHub release, build the publishable `.tmp/dist` package, publish it to npm, and then publish the GitHub release.

## Contributing

Keep changes focused on the relevant worker module and add or update tests near the behavior being changed. For user-facing editor behavior, prefer an e2e scenario in `packages/e2e/src`; for focused document, rendering, or command behavior, prefer a unit test in `packages/editor-worker/test`.

Before opening a pull request, run:

```sh
npm run build
npm test
npm run type-check
npm run lint
```

For changes that affect browser behavior, also run:

```sh
cd packages/e2e
npm run e2e:headless
```

## License

MIT

## Embedded editors

`@lvce-editor/editor-worker/dist/diff-sdk.js` exports `createEmbeddedEditor(options)`
with TypeScript declarations. It does not start a worker or install message
listeners. Bundle this entry into the embedding worker; the normal editor worker
entry does not import it.

The host supplies a unique editor ID, document URI, optional application ID,
content, font metrics, tokenizer path, and viewport geometry through
`StandaloneEditorOptions`. Initialize the shared `@lvce-editor/rpc-registry`
connections before invoking commands that use workbench services (including
syntax highlighting, preferences, clipboard, and language providers). The SDK
keeps that dependency external so the host and SDK use the same connections.

The returned editor exposes `execute(command, ...args)`, `getState()`, and
`dispose()`. State commands accept the usual `Editor.` or `EditorText.` command
IDs, or their short names, with the same arguments as the normal editor.
Commands operate on document coordinates. The embedding view is responsible for
mapping pointer positions and rendering anchors to its display rows.
Worker lifecycle commands and getters are not accepted by `execute`.

Accepted commands run in order and retain normal-editor undo, selection, and
same-document synchronization behavior. Read state after awaiting a command.
Treat returned state as read-only. Await `dispose()` before reusing an ID;
disposal rejects new commands and drains commands already accepted.
