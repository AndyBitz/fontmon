// Native
const { format } = require('url')

// Packages
const {
  BrowserWindow,
  app,
  Tray,
  Menu,
  autoUpdater
} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')

// lib
const loader = require('./lib/loader')

// globals
let mainWindow
let tray

const server = `https://updater.fontmon.now.sh`
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

autoUpdater(feed)

const trayIconPath = (process.platform === 'win32')
  ? resolve(`/assets/tray-icon-16.ico`)
  : resolve(`/assets/tray-icon-16.png`)

const windowIconPath = (process.platform === 'win32')
  ? resolve(`/assets/window-icon-48.ico`)
  : resolve(`/assets/window-icon-48.png`)

const createWindow = async () => {
  await prepareNext('./renderer')

  mainWindow = new BrowserWindow({
    title: 'fontmon',
    width: 400,
    height: 300,
    minWidth: 400,
    minHeight: 300,
    icon: windowIconPath
  })

  mainWindow.setMenu(null)
  // mainWindow.webContents.openDevTools()

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
  const trayIcon = trayIconPath

  tray = new Tray(trayIcon)

  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => {
      app.isQuitting = true
      app.quit()
    }}
  ])

  tray.setToolTip('fontmon')
  tray.setContextMenu(contextMenu)

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
    if (app.isQuitting === undefined && process.platform !== 'linux') {
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
        setTimeout(app.quit, 100) 
      })
      .catch((err) => {
        app.isUnloaded = true
        throw new Error('Could not unload all fonts.', err)
        setTimeout(app.quit, 100)        
      })
  }
})
