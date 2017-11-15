// Native
const { format } = require('url')

// Packages
const {
  BrowserWindow,
  app,
  Tray,
  Menu
} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')

// lib
const loader = require('./lib/loader')

// globals
let mainWindow
let tray


const createWindow = async () => {
  await prepareNext('./renderer')

  mainWindow = new BrowserWindow({
    width: 400,
    height: 300
  })

  mainWindow.setMenu(null)
  mainWindow.webContents.openDevTools()

  const devPath = 'http://localhost:8000/start'

  const prodPath = format({
    pathname: resolve('renderer/out/start/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const url = isDev ? devPath : prodPath
  mainWindow.loadURL(url)

  return mainWindow
}

const createTrayicon = async (win) => {
  const trayIcon = (process.platform === 'win32')
    ? resolve(`/assets/tray-icon.ico`)
    : resolve(`/assets/tray-icon.png`)

  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => {
      app.isQuitting = true
      app.quit()
    }}
  ])

  tray.setToolTip('fontmon')
  tray.setContextMenu(contextMenu)

  // TODO: make extra menu item for this on linux
  tray.on('click', () => {
    if (win.isVisible() === false) {
      win.show()
    }

    if (win.isMinimized() === true) {
      win.restore()
    }

    if (win.isFocused() === false) {
      win.focus()
    }
  })

  // only hide window on close
  win.on('close', (event) => {
    if (app.isQuitting === undefined) {
      event.preventDefault()
      win.hide()
    }
  })
}

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  const win = await createWindow()
  createTrayicon(win)
})

// handle before quitting
app.on('will-quit', (event) => {

  if (app.isUnloaded === undefined) {
    event.preventDefault()

    // unload all fonts before quitting
    loader.unloadAll()
      .then((status) => {
        app.isUnloaded = true
        app.quit()
      })
      .catch((err) => {
        app.isUnloaded = true
        app.quit()
        throw new Error('Could not unload all fonts.', err)
      })
  }
})
