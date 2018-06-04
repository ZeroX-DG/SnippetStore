import { SNIPPET_INFO_FILE } from '../config'
const sander = require('sander')

function fetchSnippets () {
  return JSON.parse(sander.readFileSync(SNIPPET_INFO_FILE, { encoding: 'utf-8' }))
}

module.exports = fetchSnippets
