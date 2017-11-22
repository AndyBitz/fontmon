// packages
const {execFile} = require('child_process')
const path = require('path')


// execute a file and return it's stdout
const exec = (cmd, args) => new Promise((res, rej) => {
  const options = { windowsHide: true }

  const callback = (error, stdout, stderr) => {
    if (error || stderr) {
      rej(error || stderr)
    }

    res(stdout)
  }

  execFile(cmd, args, options, callback)
})

// executs the fontloader.exe for windows with the given arguments
// arguments are either add or remove and the fontpath
exec.execWinFontLoader = async (args) => {
  const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
  const result = await exec(exe, args)
  const fixPath = result.replace(/\\/g, '\\\\')
  return JSON.parse(fixPath)
}

module.exports = exec
