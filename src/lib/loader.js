const {execFile} = require('child_process')
const path = require('path')
const {promisify} = require('util')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

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


class Loader {
  constructor() {
    this.loadedFonts = []
  }

  // loads a font
  async add(fontpath) {
    fontpath = path.normalize(fontpath)

    switch (process.platform) {
      case 'win32': 
        const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
        const result = await asyncExec(exe, ['add', fontpath])
        const fixPath = result.replace(/\\/g, '\\\\')
        const jsonResult = JSON.parse(fixPath)

        if (jsonResult.result === 1) {
          this.loadedFonts.push(jsonResult.path)
        }

        return jsonResult

      case 'darwin':
        // move font to ~/Library/Fonts
        // link font
        // ln -s $PATH ~/Library/Fonts/$FILENAME

      case 'linux':
        // move font to ~/.fonts
        // link font (absolute paths!)
        // ln -s '/home/sam/Downloads/Oxygen-Regular.ttf' /home/sam/.local/share/fonts/

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
        const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
        const result = await asyncExec(exe, ['remove', fontpath])
        const fixPath = result.replace(/\\/g, '\\\\')
        const jsonResult = JSON.parse(fixPath)

        if (jsonResult.result === 1) {
          this.loadedFonts = this.filterFont(jsonResult.path)
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
      await this.remove(this.loadedFonts[0])
    }
  }

  // returns all fonts that are installed
  getAll() {
    return this.loadedFonts
  }

  // returns a new array without fontpath
  filterFont(fontpath) {
    return this.loadedFonts.filter((font) => {
      if (font !== fontpath) {
        return true
      }
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
        files = files.concat(await readFontFilesRecursive(abs))
      } else {
        if (Loader.isFont(abs)) {
          files.push(abs)
        }
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
