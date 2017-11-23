const {Tray, Menu, app} = require('electron')
const {resolve} = require('app-root-path')


module.exports = (mainWindow) => {
  const trayIconPath = (process.platform === 'win32')
    ? resolve(`/assets/tray/windows.ico`)
    : resolve(`/assets/tray/tray.png`)

  const tray = new Tray(trayIconPath)

  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => {
      app.isQuitting = true
      app.quit()
    }}
  ])

  tray.setToolTip('fontmon')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow.isVisible() === false) {
      mainWindow.show()
    }

    if (mainWindow.isMinimized() === true) {
      mainWindow.restore()
    }

    if (mainWindow.isFocused() === false) {
      mainWindow.focus()
    }
  })

  // only hide window on close
  mainWindow.on('close', (event) => {
    if (app.isQuitting === undefined && process.platform !== 'linux') {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  return tray
}
