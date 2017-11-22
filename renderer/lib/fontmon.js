// The Fontmon singleton class abstracts
// the Loader class and will be loaded in the renderer.
// It uses the date and methods from loader and
// makes sure events are dispatched to display the change.


// native
const {resolve, join, parse} = require('path')
const EventEmitter = require('events')

// packages
const loader = require('electron').remote.require('./lib/loader')


class Fontmon extends EventEmitter {
  constructor() {
    super()

    loader.on('change', (status) => {
      this.emit('change', status)
    })
  }

  // returns a list of all loaded fonts from loader
  getLoadedFonts() {
    return loader.getAll()
  }

  // use FileList to load all fonts
  // or all fonts within directories
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
      statusList.push(await loader.add(file))
    }

    // will dispatch one array with the status to each font added
    this.emit('change', statusList)
  }
}

// singleton
Fontmon.instance = Fontmon.instance || new Fontmon()

export default Fontmon.instance
