const {execFile} = require('child_process')
const path = require('path')
const {promisify} = require('util')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

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

const execWinFontloader = async (args) => {
  const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
  return await asyncExec(exe, args)
}


class Loader {
  constructor() {
    this.loadedFonts = []
  }

  // returns all fonts that are installed
  getAll() {
    return this.loadedFonts
  }

  // loads a font
  async add(fontpath) {
    fontpath = path.normalize(fontpath)

    switch (process.platform) {
      case 'win32': 
        const result = await execWinFontloader(['add', fontpath])
        const fixPath = result.replace(/\\/g, '\\\\')
        const jsonResult = JSON.parse(fixPath)

        if (jsonResult.status === 1) {
          this.addToList(jsonResult)
        }

        return jsonResult

      case 'darwin': // ln -s $PATH ~/Library/Fonts/$FILENAME
      case 'linux': // ln -s '/home/sam/Downloads/Oxygen-Regular.ttf' /home/sam/.local/share/fonts/
      case 'freebsd':
      case 'sunos':

      default:
        throw new Error(`${process.platform} is not supported.`)
    }
  }

  // unloads a font
  async remove(fontpath) {
    fontpath = path.normalize(fontpath)

    switch (process.platform) {
      case 'win32': 
        const result = await execWinFontloader(['remove', fontpath])
        const fixPath = result.replace(/\\/g, '\\\\')
        const jsonResult = JSON.parse(fixPath)

        if (jsonResult.status === 1) {
          this.removeFromList(jsonResult)
        }

        return jsonResult

      case 'darwin':
      case 'linux':
      case 'freebsd':
      case 'sunos':

      default:
        throw new Error(`${process.platform} is not supported.`)
    }
  }

  // unloads all fonts that are installed
  async unloadAll() {
    const len = this.loadedFonts.length-1

    for (let i=0; i < len; i++) {
      await this.remove(this.loadedFonts[0].path)
    }
  }

  // adds a font to the installed list
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
