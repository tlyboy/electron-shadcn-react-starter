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
```

`pnpm dev` 执行 `electron-forge start`。`pnpm package` 把未打包的应用写到 `out/`。`pnpm make` 生成当前平台的安装包。

`pnpm-workspace.yaml` 设置了 `nodeLinker: hoisted`，`.npmrc` 也写了同一项。Electron Forge 从这个目录布局复制生产依赖。

### 发布

PR 会构建三个平台的安装包。发布工作流由推送到 `release` 分支或手动运行触发，按照 `package.json` 的版本汇总安装包到同一个 GitHub Release 草稿，并将草稿绑定到构建提交。

本地发布时，先把 `package.json` 的 `repository.url` 改为自己的 GitHub 仓库，为构建提交创建并推送对应的 `v<version>` 标签，然后设置 `GITHUB_TOKEN` 并运行 `pnpm release`。`pnpm run publish` 是 `pnpm release` 的别名。

### 签名

设置 `CSC_NAME` 后，macOS 构建会使用 Electron 的默认权限配置签名。发布工作流把 `APPLE_CERTIFICATE` 导入临时钥匙串，并导出签名身份。签名构建在 `APPLE_ID`、`APPLE_APP_SPECIFIC_PASSWORD`、`APPLE_TEAM_ID` 都有值时会进行公证。工作流把 `APPLE_PASSWORD` 密钥映射为 `APPLE_APP_SPECIFIC_PASSWORD`。

在 Windows 上设置 `CSC_LINK` 和 `CSC_KEY_PASSWORD` 后才会进行 Windows 签名。若设置了 `WIN_CSC_LINK` 和 `WIN_CSC_KEY_PASSWORD`，则使用这两项。`CSC_LINK` 可以是文件路径、`file://` 地址，或 base64 编码的 `.pfx`。发布工作流不传入 Windows 证书。

### 更新

自动更新默认关闭。要为打包后的 macOS 和 Windows 应用启用更新，请在 `package.json` 中将 `autoUpdateRepository` 设为自己的公开 GitHub 仓库，格式为 `owner/repo`。发布 GitHub Release 后，更新服务才能提供安装包。macOS 自动更新要求应用已签名。 [Electron Forge 自动更新文档](https://www.electronforge.io/advanced/auto-update)

### 安装包

- macOS：DMG 和 ZIP，arm64 与 x64
- Windows：Squirrel 安装包，x64
- Linux：deb 和 rpm

## 使用许可

[MIT](https://opensource.org/licenses/MIT) © tlyboy
