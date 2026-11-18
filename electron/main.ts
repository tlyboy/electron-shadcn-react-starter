import { app, BrowserWindow } from 'electron'
import log from 'electron-log/main.js'
import started from 'electron-squirrel-startup'
import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
import path from 'node:path'

import { autoUpdateRepository } from '../package.json'

function windowIcon() {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    return path.join(app.getAppPath(), 'public', 'favicon.ico')
  }
  return path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/favicon.ico`)
}

function createWindow() {
  const win = new BrowserWindow({
    icon: windowIcon(),
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
}

if (started) {
  app.quit()
} else {
  log.initialize()
  log.transports.file.level = 'info'

  if (autoUpdateRepository && !process.argv.includes('--squirrel-firstrun')) {
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: autoUpdateRepository,
      },
      logger: log,
    })
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}
