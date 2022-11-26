const { existsSync, readFileSync } = require('fs')
const { join } = require('path')
 
const { platform, arch } = process
 
let nativeBinding = null
let localFileExisted = false
let isMusl = false
let loadError = null
console.debug({platform, arch});

 
switch (platform) {
  case 'linux':
    switch (arch) {
      case 'x64':
        console.debug(join(__dirname, 'noderscam.linux-x64-gnu.node'));
        localFileExisted = existsSync(join(__dirname, 'noderscam.linux-x64-gnu.node'))
        console.debug(localFileExisted);
        try {
          if (localFileExisted) {
            nativeBinding = require('./noderscam.linux-x64-gnu.node')
            console.debug({nativeBinding});
          } else {
            nativeBinding = require('noderscam-linux-x64-gnu')
          }
        } catch (e) {
          console.error(e);
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'noderscam.linux-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./noderscam.linux-arm64.node')
          } else {
            nativeBinding = require('noderscam-linux-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on linux: ${arch}`)
    }
    break
  // ...
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}
 
if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}
 
module.exports = nativeBinding