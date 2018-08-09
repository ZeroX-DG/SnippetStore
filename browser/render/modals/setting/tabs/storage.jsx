import React from 'react'
import path from 'path'
import { remote } from 'electron'
import i18n from 'render/lib/i18n'
import ConfigManager from 'lib/config-manager'
import { pageView, trackEvent } from 'lib/analytics'
import eventEmitter from '../../../../lib/event-emitter'

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
        title: 'Choose new storage path',
        buttonLabel: 'Pick',
        properties: ['openDirectory']
      },
      paths => {
        if (paths && paths[0]) {
          const path = paths[0]
          this.refs.storage.value = path
          this.saveSetting()
          // confirm('Migrate your snippets to the new locations?')
        }
      }
    )
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
              ref="storage"
            />
            <button
              className="m-l-10"
              onClick={() => this.browseFolderStorage()}
            >
              Browse
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
