// The Loader singleton class will handle
// all the work when fonts are
// added or removed to the system.
// It will emit the 'change' event when add or remove is called.

const path = require('path')
const {promisify} = require('util')
const fs = require('fs')
const EventEmitter = require('events')
const {execWinFontLoader} = require('./exec')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const symlink = promisify(fs.symlink)
const unlink = promisify(fs.unlink)


class Loader extends EventEmitter {
  constructor() {
    super()
    this.loadedFonts = []
  }

  // returns all fonts that are installed
  getAll() {
    return this.loadedFonts
  }

  // check if path is already loaded
  isAlreadyLoaded(fontpath) {
    return this.loadedFonts.some((font) => (
      font.path === fontpath
    ))
  }

  async installOnWindows(fontpath) {
    return await execWinFontLoader(['add', fontpath])
  }

  async removeOnWindows(fontpath) {
    return await execWinFontLoader(['remove', fontpath])
  }

  async installOnDarwin(fontpath) {
    // ln -s $PATH ~/Library/Fonts/$FILENAME

    // const dar_fileName = path.parse(fontpath).base
    // const dar_linkPath = path.normalize(`~/Library/Fonts/${dar_fileName}`)
    // needs try-catch
    // await symlink(fontpath, dar_linkPath)

    // return {status: 1, path: dar_linkPath, type: 'add'}
  }

  async installOnLinux(fontpath) {
    // ln -s '/home/sam/Downloads/Oxygen-Regular.ttf' /home/sam/.local/share/fonts/

    // const lin_fileName = path.parse(fontpath).base
    // const lin_linkPath = path.normalize(`~/.local/share/fonts/${lin_fileName}`)
    // needs try-catch
    // await symlink(fontpath, lin_linkPath)

    // return {status: 1, path: lin_linkPath, type: 'add'}
  }

  async removeOnUnix(fontpath) {
    // await unlink(fontpath)
    // return {status: 1, path: fontpath, type: 'remove'}
  }

  // loads a font
  async add(fontpath) {
    fontpath = path.normalize(fontpath)

    if (this.isAlreadyLoaded(fontpath)) {
      return new Error(`Font at "${fontpath}" is already installed.`)
    }

    const result = await this.addOnPlatform(fontpath)

    if (result.status === 1) {
      this.addToList(result)
    }

    this.emit('change', result)
    return result
  }

  // unloads a font
  async remove(fontpath) {
    fontpath = path.normalize(fontpath)

    if (this.isAlreadyLoaded(fontpath) === false) {
      return new Error(`Font at "${fontpath}" is not loaded.`)
    }

    const result = await this.removeOnPlatform(fontpath)

    if (result.status === 1) {
      this.removeFromList(result)
    }

    this.emit('change', result)
    return result
  }

  async addOnPlatform(fontpath) {
    switch (process.platform) {
      case 'win32': 
        return await this.installOnWindows(fontpath)
      case 'darwin': 
        // return await this.installOnDarwin(fontpath)
      case 'linux': 
        // return await this.installOnLinux(fontpath)
      case 'freebsd':
      case 'sunos':
      default:
        return new Error(`${process.platform} is not supported.`)
    }
  }

  async removeOnPlatform(fontpath) {
    switch (process.platform) {
      case 'win32': 
        return await this.removeOnWindows(fontpath)
      case 'darwin':
      case 'linux':
        // return await this.removeOnUnix(fontpath)
      case 'freebsd':
      case 'sunos':
      default:
        return new Error(`${process.platform} is not supported.`)
    }
  }

  // unloads all fonts that are installed
  async unloadAll() {
    const status = []
    const loadedFontsCopy = this.loadedFonts

    if (loadedFontsCopy[0] === undefined) {
      return status
    }

    for (let i in loadedFontsCopy) {
      const fontpath = loadedFontsCopy[i].path
      status.push(await this.remove(fontpath))
    }

    return status
  }

  // adds a font to the installed list
  // with the default meta-data
  addToList(result) {
    this.loadedFonts.push({
      path: result.path,
      fileName: path.parse(result.path).base,
      remove: () => this.remove(result.path)
    })
  }

  // removes a font from the installed list
  removeFromList(result) {
    this.loadedFonts = this.loadedFonts.filter((font) => {
      return result.path !== font.path
    })
  }

  // reads one ore more directories recursively
  // and returns an array with all font files found
  async scanForFonts(dir) {
    const cstat = await stat(dir)
    let files = []

    if (cstat.isDirectory() === false) {
      return [dir]
    }

    const cdir = await readdir(dir)

    for (let i in cdir) {
      const name = cdir[i]
      const abs = path.join(dir, name)
      const stats = await stat(abs)

      if (stats.isDirectory()) {
        files = files.concat(await this.scanForFonts(abs))
      } else {
        Loader.isFont(abs) && files.push(abs)
      }
    }

    return files
  }

  // determines what file is a font file and what not
  static isFont(file) {
    return !!file.match(/\.(ttf|ttc|otf|otc|pfb|pfm|tfil|ffil|lwfn|dfont|tfil|pfa|afm)$/)
  }
}

Loader.instance = Loader.instance || new Loader()

module.exports = Loader.instance
