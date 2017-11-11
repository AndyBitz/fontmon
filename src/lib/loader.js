const {execFile} = require('child_process')
const path = require('path')
const {promisify} = require('util')
const fs = require('fs')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)


const asyncExec = (cmd, args) => new Promise((res, rej) => {
  const options = { windowsHide: true }

  const callback = (error, stdout, stderr) => {
    if (error || stderr) {
      rej(error || stderr)
    }

    res(stdout)
  }

  execFile(cmd, args, options, callback)
})


async function addFont(font) {
  font = path.normalize(font)

  switch (process.platform) {
    case 'win32': 
      // non-admin way
      const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
      const result = await asyncExec(exe, ['add', font])
      const fixPath = result.replace(/\\/g, '\\\\')
      const jsonResult = JSON.parse(fixPath)

      return jsonResult

    case 'darwin':
      // move font to ~/Library/Fonts
      // link font
      // ln -s $PATH ~/Library/Fonts/$FILENAME
      console.error('MacOS is not yet supported')
      break

    case 'linux':
      // move font to ~/.fonts
      // link font (absolute paths!)
      // ln -s '/home/sam/Downloads/Oxygen-Regular.ttf' /home/sam/.local/share/fonts/
      console.error('Linux is not yet supported')
      break

    case 'freebsd':
    case 'sunos':

    default:
      throw new Error(`${process.platform} is not supported.`)
  }
}

async function removeFont(font) {
  font = path.normalize(font)

  switch (process.platform) {
    case 'win32': 
      const exe = path.normalize(`${__dirname}/../execs/cli-fontloader.exe`)
      const result = await asyncExec(exe, ['remove', font])
      const fixPath = result.replace(/\\/g, '\\\\')
      const jsonResult = JSON.parse(fixPath)

      return jsonResult

    case 'darwin':
      console.error('MacOS is not yet supported')
      return

    case 'linux':
      console.error('Linux is not yet supported')
      return

    case 'freebsd':
    case 'sunos':

    default:
      throw new Error(`${process.platform} is not supported.`)
  }
}

async function readFontFilesRecursive(dir) {
  const cstat = await stat(dir)

  if (cstat.isDirectory() === false) {
    return [dir]
  }

  const cdir = await readdir(dir)

  let files = []

  for (let i in cdir) {
    const name = cdir[i]
    const abs = path.join(dir, name)
    const stats = await stat(abs)

    if (stats.isDirectory()) {
      files = files.concat(await readFontFilesRecursive(abs))
    } else {
      if (isFont(abs)) {
        files.push(abs)
      }
    }
  }

  return files
}

function isFont(file) {
  return !!file.match(/\.(otf|otc|ttf|ttc|fon)$/)
}

module.exports = {
  add: (font) => addFont(font),
  remove: (font) => removeFont(font),
  read: (dir) => readFontFilesRecursive(dir)
}
