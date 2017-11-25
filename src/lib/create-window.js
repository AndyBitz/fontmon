const {format} = require('url')
const {BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const prepareNext = require('electron-next')
const {resolve} = require('app-root-path')


module.exports = async () => {
  await prepareNext('./renderer')

  const windowIconPath = (process.platform === 'win32')
    ? resolve(`/assets/icons/windows.ico`)
    : resolve(`/assets/icons/window.png`)

  const mainWindow = new BrowserWindow({
    title: 'fontmon',
    width: 400,
    height: 300,
    minWidth: 400,
    minHeight: 300,
    icon: windowIconPath
  })

  mainWindow.setMenu(null)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

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
