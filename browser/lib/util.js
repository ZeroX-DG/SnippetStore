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
}

export default {
  generateKey,
  findObject
}
