import path from 'path'
import { remote } from 'electron'
import os from 'os'

const isTest = process.env.NODE_ENV === 'test'

const APP_DATA_PATH = isTest
  ? path.join(os.tmpdir(), 'SnippetStore', 'test')
  : path.join(remote.app.getPath('appData'), 'SnippetStore')

const SNIPPET_INFO_FILE = path.join(APP_DATA_PATH, 'snippets.json')

let APIConfig = {
  APP_DATA_PATH,
  SNIPPET_INFO_FILE
}

module.exports = APIConfig
