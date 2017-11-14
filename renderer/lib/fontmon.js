// native
const {resolve, join, parse} = require('path')

// packages
const loader = require('electron').remote.require('./lib/loader')


class Fontmon {
  constructor() {
    this.subscribers = []
  }

  getLoadedFonts() {
    return loader.getAll().map((font) => {
      font.remove = () => this.remove(font.path)
      return font
    })
  }

  async add(path, dispatch=true) {
    const result = await loader.add(path)

    if (dispatch) {
      this.dispatchEvent(result)
    } else {
      return result
    }

    return !!result.status
  }

  async remove(path, dispatch=true) {
    const result = await loader.remove(path)

    if (dispatch) {
      this.dispatchEvent(result)
    } else {
      return result
    }

    return !!result.status
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

  subscribe(listener) {
    this.subscribers.push(listener)
  }

  unsubscribe(listener) {
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
