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
```

`pnpm dev` runs `electron-forge start`. `pnpm package` writes an unpacked app under `out/`. `pnpm make` builds the installers for the current platform.

`pnpm-workspace.yaml` sets `nodeLinker: hoisted`, and `.npmrc` sets the same value. Electron Forge copies production dependencies from that layout.

### Releases

Pull requests build installers for all three platforms. The release workflow runs on pushes to the `release` branch or by manual dispatch. It collects the installers into one draft GitHub Release for the version in `package.json` and ties the draft to the commit that built them.

For a local release, set `repository.url` in `package.json` to your GitHub repository, push the matching `v<version>` tag for the commit you are building, and run `pnpm release` with `GITHUB_TOKEN` set. `pnpm run publish` is an alias for `pnpm release`.

### Signing

Set `CSC_NAME` to sign macOS builds with Electron’s default entitlements. The release workflow imports `APPLE_CERTIFICATE` into a temporary keychain and exports the signing identity. Signed builds are notarized when `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and `APPLE_TEAM_ID` are all set. The workflow maps the `APPLE_PASSWORD` secret to `APPLE_APP_SPECIFIC_PASSWORD`.

Windows signing runs on Windows when `CSC_LINK` and `CSC_KEY_PASSWORD` are set. `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD` take priority when they are set. `CSC_LINK` may be a file path, a `file://` URL, or a base64-encoded `.pfx`. The release workflow does not pass a Windows certificate.

### Updates

Automatic updates are disabled by default. To enable them for packaged macOS and Windows builds, set `autoUpdateRepository` in `package.json` to your public GitHub repository in `owner/repo` format. Publish the GitHub Release to make the installers available through the update service. macOS updates require code signing. [Electron Forge auto-update guide](https://www.electronforge.io/advanced/auto-update)

### Targets

- macOS: DMG and ZIP, arm64 and x64
- Windows: Squirrel installer, x64
- Linux: deb and rpm packages

## License

[MIT](https://opensource.org/licenses/MIT) © tlyboy
