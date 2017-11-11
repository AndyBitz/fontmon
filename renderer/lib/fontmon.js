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
    this.subscribers = []
    this.loadedFonts = []
  }

  getLoadedFonts() {
    return this.loadedFonts
  }

  async add(path, dispatch=true) {
    const status = await loader.add(path)
    if (status.result === 1) {
      this.loadedFonts.push(status.path)
    }

    if (dispatch) {
      this.dispatchEvent()
    }

    return !!status.result
  }

  async remove(path, dispatch=true) {
    const status = await loader.remove(path)
    if (status.result === 1) {
      this.loadedFonts = this.loadedFonts.filter((loadedFont) => {
        if (loadedFont !== path) {
          return true
        }
      })
    }

    if (dispatch) {
      this.dispatchEvent()
    }

    return !!status.result
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
        if (this.isFont(abs)) {
          files.push(abs)
        }
      }
    }

    return files
  }

  addEventListener(listener) {
    this.subscribers.push(listener)
  }

  removeEventListener(listener) {
    this.subscribers = this.subscribers.filter((sub) => {
      if (sub !== listener) {
        return sub
      }
    })
  }

  dispatchEvent() {
    this.subscribers.map(sub => sub())
  }

  async loadList(list) {
    let fileList = []

    for (let i in list) {
      const cFileList = await this.recursiveRead(list.item(i).path)
      fileList = fileList.concat(cFileList)
    }

    fileList.map((file) => {
      this.add(file, false)
    })

    this.dispatchEvent()
  }

  isFont(file) {
    return !!file.match(/\.(otf|otc|ttf|ttc|fon)$/)
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
