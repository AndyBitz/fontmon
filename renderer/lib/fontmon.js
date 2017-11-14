// The Fontmon singleton class abstracts
// the Loader class and will be loaded in the renderer.
// It uses the date and methods from loader and
// makes sure events are dispatched to display the change.


// native
const {resolve, join, parse} = require('path')

// packages
const loader = require('electron').remote.require('./lib/loader')


class Fontmon {
  constructor() {
    // list with all functions that are subscribed
    this.subscribers = []
  }

  // returns a list of all loaded fonts from loader
  getLoadedFonts() {
    return loader.getAll().map((font) => {
      // adds its remove method which will dispatch the event
      font.remove = () => this.remove(font.path)
      return font
    })
  }

  // adds a font with loader to the installed fonts
  async add(path, dispatch=true) {
    const result = await loader.add(path)

    if (dispatch) {
      this.dispatchEvent(result)
    } else {
      return result
    }

    return !!result.status
  }

  // removes a list with loader from the installed fonts
  async remove(path, dispatch=true) {
    const result = await loader.remove(path)

    if (dispatch) {
      this.dispatchEvent(result)
    } else {
      return result
    }

    return !!result.status
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
      statusList.push(await this.add(file, false))
    }

    // will dispatch one array with the status to each font added
    this.dispatchEvent(statusList)
  }

  // adds a function that will be fired on changes
  subscribe(listener) {
    this.subscribers.push(listener)
  }

  // removes a subscribed function
  unsubscribe(listener) {
    this.subscribers = this.subscribers.filter((sub) => {
      return sub !== listener
    })
  }

  // dispatch event to all subscribed lists
  dispatchEvent(args) {
    this.subscribers.map(sub => sub(args))
  }
}

// singleton
Fontmon.instance = Fontmon.instance || new Fontmon()

export default Fontmon.instance
