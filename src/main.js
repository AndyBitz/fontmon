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
let tray

const createWindow = async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300
  })

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
      loader.unloadAll()
        .then(() => {
          app.quit()
        })
        .catch((err) => {
          console.error(err)
          app.quit()
        })
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
