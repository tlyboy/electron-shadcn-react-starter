import { app, BrowserWindow, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'
import log from 'electron-log/main.js'

const { autoUpdater } = electronUpdater
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

log.initialize()
log.transports.file.level = 'info'
autoUpdater.logger = log
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

function wireAutoUpdater() {
  const send = (channel: string, payload?: unknown) =>
    win?.webContents.send(channel, payload)

  autoUpdater.on('checking-for-update', () => send('updater:checking'))
  autoUpdater.on('update-available', (info) => send('updater:available', info))
  autoUpdater.on('update-not-available', (info) =>
    send('updater:not-available', info),
  )
  autoUpdater.on('download-progress', (p) => send('updater:progress', p))
  autoUpdater.on('update-downloaded', (info) =>
    send('updater:downloaded', info),
  )
  autoUpdater.on('error', (err) => send('updater:error', err?.message))
}

ipcMain.on('updater:quitAndInstall', () => autoUpdater.quitAndInstall())
ipcMain.handle('app:version', () => app.getVersion())

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()
  wireAutoUpdater()
  if (app.isPackaged) autoUpdater.checkForUpdatesAndNotify()
})
