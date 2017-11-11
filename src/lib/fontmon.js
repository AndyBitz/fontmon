// native
const {promisify} = require('util')
const {resolve, join} = require('path')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

// packages
const config = require('./config')
const loader = require('./loader')


class Fontmon {
  constructor() {

  }

  static async add(path) {
    return await loader.add(path)
  }

  static async remove(path) {
    return await loader.remove(path)
  }

  static async getFontFiles() {
    const cfg = await config.readConfig()
    const dir = cfg.directory

    return await this.recursiveRead(dir)
  }

  static async recursiveRead(dir) {
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

  static isFont(file) {
    const fileFormats = ['ttf', 'otf']
    return !!file.match(/\.(otf|ttf)$/)
  }

  static async readFontFile() {

  }
}

module.exports = Fontmon
