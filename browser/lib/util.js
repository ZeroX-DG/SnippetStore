import crypto from 'crypto'

export function generateKey () {
  return crypto.randomBytes(20).toString('hex')
}

export function findObject (array, property, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === value) {
      return array[i]
    }
  }

  return null
}

export function findIndexObject (array, property, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][property] === value) {
      return i
    }
  }

  return -1
}

export function getExtension (name) {
  const indexOfExtension = name.lastIndexOf('.')
  if (indexOfExtension !== -1) {
    return name.substring(indexOfExtension + 1)
  } else {
    return null
  }
}

export default {
  generateKey,
  findObject,
  findIndexObject,
  getExtension
}
