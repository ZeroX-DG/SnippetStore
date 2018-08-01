import Mousetrap from 'mousetrap'
import 'mousetrap-global-bind'
import eventEmitter from 'lib/event-emitter'
import ConfigManager from 'lib/config-manager'
import _ from 'lodash'

const actions = [
  {
    name: 'createSnippet',
    action: () => {
      eventEmitter.emit('modal:open', 'pickSnippetTypeModal')
    }
  },
  {
    name: 'openSetting',
    action: () => {
      eventEmitter.emit('modal:open', 'settingModal')
    }
  },
  {
    name: 'toggleSidebar',
    action: () => {
      eventEmitter.emit('sidebar:toggle')
    }
  },
  {
    name: 'closeAllModals',
    action: () => {
      eventEmitter.emit('modal:close')
    }
  },
  {
    name: 'SaveAllSnippets',
    action: () => {
      eventEmitter.emit('snippets:saveAll')
    }
  }
]

let keys = ConfigManager.get('keyboard')

eventEmitter.on('config:set', (event, newConfig) => {
  if (!_.isEqual(keys, newConfig.keyboard)) {
    updateShortcut(newConfig.keyboard)
  }
})

export function applyShortcut (keys) {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]
    // we must format the key sequence first
    const actionKey = keys[action.name].toLowerCase().replace(/ /g, '')
    Mousetrap.bindGlobal(actionKey, action.action)
  }
}

export function updateShortcut (newShortcut) {
  Mousetrap.reset()
  keys = newShortcut
  applyShortcut(newShortcut)
}

export function getAction (name) {
  for (let i = 0; i < actions.length; i++) {
    if (actions[i].name === name) {
      return actions[i]
    }
  }
}

module.exports = applyShortcut
