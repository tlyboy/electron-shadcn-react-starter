import { app, BrowserWindow } from 'electron'
import log from 'electron-log/main.js'
import started from 'electron-squirrel-startup'
import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import path from 'node:path'

if (started) app.quit()

log.initialize()
log.transports.file.level = 'info'

updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'tlyboy/electron-shadcn-react-starter',
  },
  logger: log,
})

let win: BrowserWindow | null = null

function windowIcon() {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    return path.join(app.getAppPath(), 'public', 'favicon.ico')
  }
  return path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/favicon.ico`)
}

function createWindow() {
  win = new BrowserWindow({
    icon: windowIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
