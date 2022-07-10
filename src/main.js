

// Packages
const {app, Notification} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const {resolve} = require('app-root-path')

// Lib
const updater = require('./lib/updater')
const loader = require('./lib/loader')
const createTrayIcon = require('./lib/tray-icon')
const createWindow = require('./lib/create-window')

const appId = 'net.notsosocial.fontmon'

// Installer
if(require('electron-squirrel-startup')) {
  app.quit()
}

if (isDev === false) {
  // Activate updates
  updater()
}

// Globals
let mainWindow
let tray

app.setAppUserModelId(appId)

// Only one process
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
  mainWindow = await createWindow()
  tray = createTrayIcon(mainWindow)

  // Fix: Windows won't allow notifications
})

// Handle before quitting
app.on('will-quit', (event) => {

  if (app.isUnloaded === undefined) {
    event.preventDefault()

    // Unload all fonts before quitting
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
