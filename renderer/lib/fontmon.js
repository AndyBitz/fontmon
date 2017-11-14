// native
const {resolve, join, parse} = require('path')

// packages
const loader = require('electron').remote.require('./lib/loader')


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
      this.loadedFonts.push({
        path: status.path,
        remove: () => this.remove(status.path),
        fileName: parse(status.path).base
      })
    }

    if (dispatch) {
      this.dispatchEvent(status)
    } else {
      return status
    }

    return !!status.result
  }

  async remove(path, dispatch=true) {
    const status = await loader.remove(path)
    if (status.result === 1) {
      this.loadedFonts = this.loadedFonts.filter((loadedFont) => {
        if (loadedFont.path !== path) {
          return true
        }
      })
    }

    if (dispatch) {
      this.dispatchEvent(status)
    } else {
      return status
    }

    return !!status.result
  }

  async loadList(list) {
    let fileList = []
    let statusList = []

    const length = list.length

    for (let i=0; i < length; i++) {
      const cFileList = await loader.readDir(list.item(i).path)
      fileList = fileList.concat(cFileList)
    }

    for (let i in fileList) {
      const file = fileList[i]
      statusList.push(await this.add(file, false))
    }

    this.dispatchEvent(statusList)
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

  dispatchEvent(args) {
    this.subscribers.map(sub => sub(args))
  }
}

// singleton
Fontmon.instance = Fontmon.instance || new Fontmon()

export default Fontmon.instance
