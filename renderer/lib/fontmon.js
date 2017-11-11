// native
const {promisify} = require('util')
const {resolve, join} = require('path')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

// packages
import loader from './loader'


class Fontmon {
  constructor() {
    this.loadedFonts = []
  }

  getLoadedFonts() {
    return this.loadedFonts
  }

  async add(path) {
    const status = await loader.add(path)
    if (status.result === 1) {
      this.loadedFonts.push(status.path)
    }

    return !!status.result
  }

  async remove(path) {
    const status = await loader.remove(path)
    if (status.result === 1) {
      this.loadedFonts.push(status.path)
    }

    return !!status.result
  }

  async loadList(list) {
    let fileList = []

    for (let i in list) {
      const cFileList = await this.recursiveRead(list[i].path)
      fileList = fileList.concat(cFileList)
    }

    console.log(fileList)
  }

  async recursiveRead(dir) {
    const cstat = await stat(dir)

    if (cstat.isDirectory() === false) {
      return [dir]
    }

    const cdir = await readdir(dir)

    let files = []

    for (let i in cdir) {
      const name = cdir[i]
      const abs = join(dir, name)
      const stats = await stat(abs)

      if (stats.isDirectory()) {
        files = files.concat(await this.recursiveRead(abs))
      } else {
        files.push(abs)
      }
    }

    return files
  }

  /*
  static async getFonts() {
    const files = await this.getFontFiles()

    for (let i in files) {
      files[i] = await this.getFontMeta(files[i])
    }

    return files
  }

  static async getFontFiles() {
    const cfg = await config.readConfig()
    const dir = cfg.directory

    return await this.recursiveRead(dir)
  }

  static isFont(file) {
    const fileFormats = ['ttf', 'otf']
    return !!file.match(/\.(otf|ttf)$/)
  }

  static async getFontMeta(file) {
    return {
      path: file
    }
  }
  */
}

// singleton
Fontmon.instance = Fontmon.instance || new Fontmon()

export default Fontmon.instance
