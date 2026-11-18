# electron-shadcn-react-starter

Electron shadcn react starter. The app is built with Electron Forge and the Forge Vite plugin.

## Install

```bash
npx giget gh:tlyboy/electron-shadcn-react-starter my-project
```

## Usage

```bash
pnpm install
pnpm dev
pnpm package
pnpm make
pnpm release
```

`pnpm dev` runs `electron-forge start`. `pnpm package` writes an unpacked app under `out/`. `pnpm make` builds the installers. `pnpm release` publishes those installers to a draft GitHub Release.

`pnpm-workspace.yaml` sets `nodeLinker: hoisted`, and `.npmrc` sets the same value. Electron Forge copies production dependencies from that layout.

`pnpm run publish` is the same command as `pnpm release`. Do not run `pnpm publish` without `run`. That publishes the npm package.

## Signing

macOS signing runs when `CSC_NAME` is set. The release workflow imports `APPLE_CERTIFICATE` into a keychain and exports `CSC_NAME`. Notarization runs when `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and `APPLE_TEAM_ID` are all set. The workflow maps the `APPLE_PASSWORD` secret to `APPLE_APP_SPECIFIC_PASSWORD`.

Windows signing runs on Windows when `CSC_LINK` and `CSC_KEY_PASSWORD` are set. `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD` take priority when they are set. `CSC_LINK` may be a file path, a `file://` URL, or a base64-encoded `.pfx`. The release workflow does not pass a Windows certificate.

## Updates

A packaged macOS or Windows app checks [update.electronjs.org](https://update.electronjs.org) using this public GitHub repository. Publish the GitHub Release before the update service can see it. Draft releases are ignored. Linux builds do not auto-update.

## Targets

- macOS: DMG and ZIP, arm64 and x64
- Windows: Squirrel installer, x64
- Linux: deb and rpm packages

## License

[MIT](https://opensource.org/licenses/MIT) © tlyboy
