import { clipboard } from 'electron'

export function set (text) {
  clipboard.writeText(text)
}

export function get () {
  return clipboard.readText()
}

export default {
  get,
  set
}
