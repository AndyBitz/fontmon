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

  static async readDir() {

  }

  static async readFontFile() {

  }
}

module.exports = Fontmon
