// Native
const { format } = require('url')

// Packages
const {
  BrowserWindow,
  app,
  Tray,
  Menu,
  dialog,
  autoUpdater
} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const { resolve } = require('app-root-path')

// installer
if(require('electron-squirrel-startup')) {
  app.quit()
}

// lib
const loader = require('./lib/loader')

// globals
let mainWindow
let tray

// only one process
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    } else {
      mainWindow.focus()
    }
  }
})

if (isSecondInstance) {
  app.quit()
}

// set update server
const server = `https://releases.fontmon.now.sh`
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

// set url
autoUpdater.setFeedURL(feed)

if (isDev === false) {
  // check for updates
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 60000)
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})

const trayIconPath = (process.platform === 'win32')
  ? resolve(`/assets/tray/windows.ico`)
  : resolve(`/assets/tray/tray.png`)

const windowIconPath = (process.platform === 'win32')
  ? resolve(`/assets/icons/windows.ico`)
  : resolve(`/assets/icons/window.png`)

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
