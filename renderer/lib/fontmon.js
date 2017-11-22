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

    // pass events from loader up to fontmon
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
  async loadList(fileList) {
    const length = fileList.length

    for (let i=0; i < length; i++) {
      const path = fileList.item(i).path
      const list = await loader.scanForFonts(path)
      list.map((file) => loader.add(file))
    }
  }
}

// singleton
Fontmon.instance = Fontmon.instance || new Fontmon()

export default Fontmon.instance
