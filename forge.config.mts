import { existsSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { PublisherGitHub } from '@electron-forge/publisher-github'
import type { ForgeConfig } from '@electron-forge/shared-types'
import { FuseV1Options, FuseVersion } from '@electron/fuses'

import packageJson from './package.json' with { type: 'json' }

const githubRepository = /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/.exec(
  packageJson.repository.url,
)

function present(name: string): string | undefined {
  const value = process.env[name]
  if (!value) return undefined
  return value
}

function certificateFileFromCscLink(link: string): string {
  if (link.startsWith('file://')) return fileURLToPath(link)
  if (existsSync(link)) return link
  const file = path.join(tmpdir(), 'forge-csc-link.pfx')
  writeFileSync(file, Buffer.from(link, 'base64'))
  return file
}

function windowsCertificate():
  | { certificateFile: string; certificatePassword: string }
  | undefined {
  if (process.platform !== 'win32') return undefined
  const link = present('WIN_CSC_LINK') ?? present('CSC_LINK')
  const certificatePassword = present('WIN_CSC_KEY_PASSWORD') ?? present('CSC_KEY_PASSWORD')
  if (!link || !certificatePassword) return undefined
  return {
    certificateFile: certificateFileFromCscLink(link),
    certificatePassword,
  }
}

function osxSignConfig() {
  const identity = present('CSC_NAME')
  if (!identity) return undefined
  return {
    identity,
    keychain: present('CSC_KEYCHAIN'),
    continueOnError: false,
  }
}

function osxNotarizeConfig() {
  const appleId = present('APPLE_ID')
  const appleIdPassword = present('APPLE_APP_SPECIFIC_PASSWORD')
  const teamId = present('APPLE_TEAM_ID')
  if (!appleId || !appleIdPassword || !teamId) return undefined
  return { appleId, appleIdPassword, teamId }
}

const windowsCert = windowsCertificate()
const osxSign = osxSignConfig()

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: 'electron-shadcn-react-starter',
    appBundleId: 'com.tlyboy.electron-shadcn-react-starter',
    appCategoryType: 'public.app-category.developer-tools',
    icon: 'build/icon',
    osxSign,
    osxNotarize: osxSign && osxNotarizeConfig(),
    windowsSign: windowsCert,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: 'build/icon.ico',
      ...windowsCert,
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({ icon: 'build/icon.icns', title: 'Electron shadcn starter' }, ['darwin']),
    new MakerDeb({
      options: {
        icon: 'build/icon.png',
        categories: ['Development'],
      },
    }),
    new MakerRpm({
      options: {
        icon: 'build/icon.png',
        categories: ['Development'],
      },
    }),
  ],
  publishers: githubRepository
    ? [
        new PublisherGitHub({
          repository: { owner: githubRepository[1], name: githubRepository[2] },
          draft: true,
        }),
      ]
    : [],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'electron/main.ts',
          config: 'vite.main.config.mts',
          target: 'main',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
    }),
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
}

export default config
