import React from 'react'
import ConfigManager from 'lib/config-manager'
import i18n from 'render/lib/i18n'
import { pageView, trackEvent } from 'lib/analytics'

export default class HotKeysTab extends React.Component {
  componentDidMount () {
    pageView('/setting/hotkey')
  }

  saveSetting () {
    const newSetting = {
      keyboard: {
        createSnippet: this.refs.createSnippet.value,
        openSetting: this.refs.openSetting.value,
        toggleSidebar: this.refs.toggleSidebar.value
      }
    }

    ConfigManager.set(newSetting)
    trackEvent('user interaction', 'save setting', 'hotkey')
    this.refs.message.classList.remove('hide')
    setTimeout(() => {
      this.refs.message.classList.add('hide')
    }, 2000)
  }

  render () {
    const { keyboard } = this.props.config
    return (
      <div className="hotkeys-tab">
        <h1 className="tab-title">{i18n.__('HotKeys')}</h1>
        <div className="middle-content">
          <div className="input-group">
            <label>{i18n.__('Create snippet')}</label>
            <input
              type="text"
              defaultValue={keyboard.createSnippet}
              ref="createSnippet"
            />
          </div>
          <div className="input-group">
            <label>{i18n.__('Open setting')}</label>
            <input
              type="text"
              defaultValue={keyboard.openSetting}
              ref="openSetting"
            />
          </div>
          <div className="input-group">
            <label>{i18n.__('Toggle small sidebar')}</label>
            <input
              type="text"
              defaultValue={keyboard.toggleSidebar}
              ref="toggleSidebar"
            />
          </div>
        </div>
        <div className="bottom-tool">
          <label className="message success hide" ref="message">
            {i18n.__('Hotkeys setting saved')}
          </label>
          <button onClick={this.saveSetting.bind(this)}>
            {i18n.__('Save')}
          </button>
        </div>
      </div>
    )
  }
}
