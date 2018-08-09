import eventEmiter from './event-emitter'
import _ from 'lodash'
const Store = require('electron-store')
const store = new Store({ name: 'SnippetStoreConf' })

const OSX = global.process.platform === 'darwin'

const DEFAULT_CONFIG = {
  ui: {
    dateFormat: 'dd/mm/yyyy',
    theme: 'dark',
    language: 'en',
    showCopyNoti: true,
    showDeleteConfirmDialog: true,
    showSnippetCreateTime: true,
    showSnippetUpdateTime: true,
    showSnippetCopyCount: true,
    smallSidebar: false,
    layout: 'original',
    tagColor: {
      background: '#3742fa',
      foreground: 'white'
    }
  },
  editor: {
    showLineNumber: true,
    theme: 'seti',
    fontFamily: 'Fira Code, Consolas, sans-serif',
    fontSize: 18,
    indentUsingTab: false,
    tabSize: 2,
    highlightCurrentLine: true
  },
  keyboard: {
    createSnippet: OSX ? 'command + N' : 'Ctrl + N',
    openSetting: OSX ? 'command + ,' : 'Ctrl + ,',
    toggleSidebar: OSX ? 'command + B' : 'Ctrl + B',
    closeAllModals: 'Esc',
    SaveAllSnippets: OSX ? 'command + S' : 'Ctrl + S',
    CancelEditSnippets: 'Esc',
    TogglePreviousSnippet: OSX ? 'command + pageup' : 'Ctrl + pageup',
    ToggleNextSnippet: OSX ? 'command + pagedown' : 'Ctrl + pagedown'
  },
  allowAnalytics: true
}

function get (option) {
  let config = store.get('config')
  if (!config) {
    config = DEFAULT_CONFIG
    persistConfig(config)
  }

  config = _.merge(DEFAULT_CONFIG, config)

  if (!_.isEqual(config, DEFAULT_CONFIG)) {
    persistConfig(config)
  }

  if (typeof option === 'string') {
    const optionPath = option.split('->')
    let optionData = config[optionPath[0]]
    for (let i = 1; i < optionPath.length; i++) {
      optionData = optionData[optionPath[i]]
    }
    return optionData
  } else {
    return config
  }
}

function set (config) {
  const currentConfig = get()
  const newConfig = _.merge({}, DEFAULT_CONFIG, currentConfig, config)
  eventEmiter.emit('config:set', newConfig)
  persistConfig(newConfig)
}

function persistConfig (config) {
  store.set('config', config)
}

export default {
  get,
  set
}
