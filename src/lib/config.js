// packages
const {homedir} = require('os')
const util = require('util')
const fs = require('fs')
const path = require('path')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)


class Config {
  constructor() {
    this.configPath = path.join(homedir(), '.fontmon.json')
  }

  // read the config file
  // set to default if file is empty
  async readConfig() {
    return readFile(this.configPath)
      .then(data => JSON.parse(data))
      .catch(err => {
        if (err.code === 'ENOENT') {
          this.setDefaultConfig()
          return Config.defaultConfig
        } else {
          throw err
        }
      })
  }

  // write an object or a string to the config file
  // will replace everything in it
  async writeConfig(data) {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    data = JSON.stringify(data, 2, 2)

    return writeFile(this.configPath, data)
  }

  // write the default config to
  // the config file
  async setDefaultConfig() {
    return this.writeConfig(Config.defaultConfig)
  }
}


Config.defaultConfig = {
  directory: '',
  email: '',
  token: ''
}

// singleton
Config.instance = Config.instance || new Config()

module.exports = Config.instance
