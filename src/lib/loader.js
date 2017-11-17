// The Loader singleton class will handle
// all the work when fonts are
// added or removed to the system.
// It does not emit any events.

const {execFile} = require('child_process')
const path = require('path')
const {promisify} = require('util')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const symlink = promisify(fs.symlink)
const unlink = promisify(fs.unlink)


// execute a file and return it's stdout
const asyncExec = (cmd, args) => new Promise((res, rej) => {
  const options = { windowsHide: true }

  const callback = (error, stdout, stderr) => {
    if (error || stderr) {
      rej(error || stderr)
    }

    res(stdout)
  }

  execFile(cmd, args, options, callback)
})

// executs the fontloader.exe for windows with the given arguments
// arguments are either add or remove and the fontpath
const execWinFontloader = async (args) => {
  const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
  const result = await asyncExec(exe, args)
  const fixPath = result.replace(/\\/g, '\\\\')
  return JSON.parse(fixPath)
}


class Loader {
  constructor() {
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

  // loads a font
  async add(fontpath) {
    fontpath = path.normalize(fontpath)

    if (this.isAlreadyLoaded(fontpath)) {
      return Error(`Font ${fontpath} is already installed.`)
    }

    switch (process.platform) {
      case 'win32': 
        const result = await execWinFontloader(['add', fontpath])

        if (result.status === 1) {
          this.addToList(result)
        }

        return result

      case 'darwin': // ln -s $PATH ~/Library/Fonts/$FILENAME
        try {
          const fileName = path.parse(fontpath).base
          const linkPath = path.normalize(`~/Library/Fonts/${fileName}`)
          await symlink(fontpath, linkPath)
        } catch(err) {
          return {status: 0, path: linkPath, type: 'add'}
        }

        return {status: 1, path: linkPath, type: 'add'}

      case 'linux': // ln -s '/home/sam/Downloads/Oxygen-Regular.ttf' /home/sam/.local/share/fonts/
        try {
          const fileName = path.parse(fontpath).base
          const linkPath = path.normalize(`~/.local/share/fonts/${fileName}`)
          await symlink(fontpath, linkPath)
        } catch(err) {
          return {status: 0, path: linkPath, type: 'add'}
        }

        return {status: 1, path: linkPath, type: 'add'}

      case 'freebsd':
      case 'sunos':

      default:
        throw new Error(`${process.platform} is not supported.`)
    }
  }

  // unloads a font
  async remove(fontpath) {
    fontpath = path.normalize(fontpath)

    if (this.isAlreadyLoaded(fontpath) === false) {
      return Error(`Font is not loaded ${fontpath}.`)
    }

    switch (process.platform) {
      case 'win32': 
        const result = await execWinFontloader(['remove', fontpath])

        if (result.status === 1) {
          this.removeFromList(result)
        }

        return result

      case 'darwin':
      case 'linux':
        try {
          await unlink(fontpath)
        } catch(err) {
          return {status: 0, path: fontpath, type: 'remove'}
        }

        return {status: 1, path: fontpath, type: 'remove'}

      case 'freebsd':
      case 'sunos':

      default:
        throw new Error(`${process.platform} is not supported.`)
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
      status.push(await this.remove(loadedFontsCopy[i].path))
    }

    return status
  }

  // adds a font to the installed list
  // with the default meta-data
  addToList(result) {
    this.loadedFonts.push({
      path: result.path,
      fileName: path.parse(result.path).base
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
  async readDir(dir) {
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
        files = files.concat(await this.readDir(abs))
      } else {
        Loader.isFont(abs) && files.push(abs)
      }
    }

    return files
  }

  // determines what file is a font file and what not
  static isFont(file) {
    return !!file.match(/\.(otf|otc|ttf|ttc|fon)$/)
  }
}

Loader.instance = Loader.instance || new Loader()

module.exports = Loader.instance
