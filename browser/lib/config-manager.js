import eventEmiter from './event-emitter'
import _ from 'lodash'
const Store = require('electron-store')
const store = new Store({ name: 'SnippetStoreConf' })

const DEFAULT_CONFIG = {
  ui: {
    dateFormat: 'dd/mm/yyyy',
    theme: 'dark'
  },
  editor: {
    showLineNumber: true,
    theme: 'seti'
  }
}

function get (option) {
  let config = store.get('config')
  if (!config) {
    config = DEFAULT_CONFIG
    persistConfig(config)
  }

  config = _.merge({}, DEFAULT_CONFIG, config)

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
  eventEmiter.emit('config:set', config)
  persistConfig(config)
}

function persistConfig (config) {
  store.set('config', config)
}

export default {
  get,
  set
}