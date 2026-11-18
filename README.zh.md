# electron-shadcn-react-starter

Electron shadcn react starter。构建工具是 Electron Forge 和 Forge 的 Vite 插件。

## 安装

```bash
npx giget gh:tlyboy/electron-shadcn-react-starter my-project
```

## 使用说明

```bash
pnpm install
pnpm dev
pnpm package
pnpm make
pnpm release
```

`pnpm dev` 执行 `electron-forge start`。`pnpm package` 把未打包的应用写到 `out/`。`pnpm make` 生成安装包。`pnpm release` 把安装包发布到 GitHub Release 草稿。

`pnpm-workspace.yaml` 设置了 `nodeLinker: hoisted`，`.npmrc` 也写了同一项。Electron Forge 从这个目录布局复制生产依赖。

`pnpm run publish` 与 `pnpm release` 相同。不要直接执行 `pnpm publish`。那条命令会把 npm 包发布到仓库。

## 签名

设置 `CSC_NAME` 后才会进行 macOS 签名。发布工作流把 `APPLE_CERTIFICATE` 导入钥匙串，并写出 `CSC_NAME`。`APPLE_ID`、`APPLE_APP_SPECIFIC_PASSWORD`、`APPLE_TEAM_ID` 都有值时才会公证。工作流把 `APPLE_PASSWORD` 密钥写入 `APPLE_APP_SPECIFIC_PASSWORD`。

在 Windows 上设置 `CSC_LINK` 和 `CSC_KEY_PASSWORD` 后才会进行 Windows 签名。若设置了 `WIN_CSC_LINK` 和 `WIN_CSC_KEY_PASSWORD`，则使用这两项。`CSC_LINK` 可以是文件路径、`file://` 地址，或 base64 编码的 `.pfx`。发布工作流不传入 Windows 证书。

## 更新

已打包的 macOS 和 Windows 应用通过 [update.electronjs.org](https://update.electronjs.org) 检查这个公开 GitHub 仓库。GitHub Release 必须是已发布状态，草稿不会被更新服务读取。Linux 安装包不会自动更新。

## 安装包

- macOS：DMG 和 ZIP，arm64 与 x64
- Windows：Squirrel 安装包，x64
- Linux：deb 和 rpm

## 使用许可

[MIT](https://opensource.org/licenses/MIT) © tlyboy
