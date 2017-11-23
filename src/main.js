

// Packages
const {app} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const {resolve} = require('app-root-path')

// lib
const updater = require('./lib/updater')
const loader = require('./lib/loader')
const createTrayIcon = require('./lib/tray-icon')
const createWindow = require('./lib/create-window')

const appId = 'io.fontmon.app'

// installer
if(require('electron-squirrel-startup')) {
  app.quit()
}

if (isDev === false) {
  // activate updates
  updater()
}

// globals
let mainWindow
let tray

app.setAppUserModelId(appId)

// only one process
const isSecondInstance = app.makeSingleInstance(() => {
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

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  mainWindow = await createWindow(app)
  tray = createTrayIcon(mainWindow)
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
