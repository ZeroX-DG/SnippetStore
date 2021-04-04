import React from 'react'
import path from 'path'
import { remote } from 'electron'
import i18n from 'render/lib/i18n'
import ConfigManager from 'lib/config-manager'
import { pageView, trackEvent } from 'lib/analytics'
import eventEmitter from '../../../../lib/event-emitter'
import { migrateSnippet } from 'core/API/snippet'

const defaultStorage = path.join(remote.app.getPath('appData'), 'SnippetStore')
const { dialog } = remote

export default class StorageTab extends React.Component {
  componentDidMount () {
    pageView('/setting/storage')
  }

  saveSetting () {
    const newSetting = {
      storage: this.refs.storage.value
    }

    ConfigManager.set(newSetting)
    trackEvent('user interaction', 'save setting', 'storage')
    eventEmitter.emit('storage:update')
    this.refs.message.classList.remove('hide')
    setTimeout(() => {
      if (this.refs.message) {
        this.refs.message.classList.add('hide')
      }
    }, 2000)
  }

  browseFolderStorage () {
    dialog.showOpenDialog(
      {
        title: i18n.__('Choose new storage path'),
        buttonLabel: i18n.__('Pick'),
        properties: ['openDirectory']
      },
      paths => {
        if (paths && paths[0]) {
          this.changeStorage(paths[0])
        }
      }
    )
  }

  changeStorage (newPath) {
    const oldPath = this.refs.storage.value || defaultStorage
    this.refs.storage.value = newPath
    this.saveSetting()
    if (confirm(i18n.__('Migrate your snippets to the new locations?'))) {
      migrateSnippet(path.join(oldPath, 'snippets.json'))
    }
  }

  render () {
    const { config } = this.props
    return (
      <div className="storage-tab">
        <h1 className="tab-title">{i18n.__('Storage')}</h1>
        <div className="middle-content">
          <div className="group">
            <label>{i18n.__('Snippet storage path:')}</label>
            <input
              type="text"
              defaultValue={config.storage}
              placeholder={defaultStorage}
              readOnly={true}
              ref="storage"
            />
            <button
              className="m-l-10"
              onClick={() => this.browseFolderStorage()}
            >
              {i18n.__('Browse')}
            </button>
            <button
              className="m-l-10"
              onClick={() => this.changeStorage(defaultStorage)}
            >
              {i18n.__('Use default')}
            </button>
          </div>
        </div>
        <div className="bottom-tool">
          <label className="message success hide" ref="message">
            {i18n.__('Storage setting saved')}
          </label>
          <button onClick={this.saveSetting.bind(this)}>
            {i18n.__('Save')}
          </button>
        </div>
      </div>
    )
  }
}
