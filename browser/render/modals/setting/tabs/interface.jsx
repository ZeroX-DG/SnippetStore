import React from 'react'
import { getLanguages } from 'render/lib/languages'
import { getLayouts } from 'render/lib/layouts'
import ConfigManager from 'lib/config-manager'
import i18n from 'render/lib/i18n'
import { pageView, trackEvent } from 'lib/analytics'

export default class InterfaceTab extends React.Component {
  componentDidMount () {
    pageView('/setting/interface')
  }

  saveSetting () {
    const newSetting = {
      ui: {
        theme: this.refs.theme.value,
        dateFormat: this.refs.dateFormat.value,
        language: this.refs.language.value,
        showCopyNoti: this.refs.showCopyNoti.checked,
        showDeleteConfirmDialog: this.refs.showDeleteConfirmDialog.checked,
        showSnippetCreateTime: this.refs.showSnippetCreateTime.checked,
        showSnippetUpdateTime: this.refs.showSnippetUpdateTime.checked,
        showSnippetCopyCount: this.refs.showSnippetCopyCount.checked,
        layout: this.refs.layout.value,
        tagColor: {
          background: this.refs.tagBackground.value,
          foreground: this.refs.tagForeground.value
        }
      }
    }

    ConfigManager.set(newSetting)
    trackEvent('user interaction', 'save setting', 'interface')
    this.refs.message.classList.remove('hide')
    setTimeout(() => {
      if (this.refs.message) {
        this.refs.message.classList.add('hide')
      }
    }, 2000)
  }

  render () {
    const { config } = this.props
    const { theme } = config.ui
    const languages = getLanguages()
    const layouts = getLayouts()
    return (
      <div className="interface-tab">
        <h1 className="tab-title">{i18n.__('Interface')}</h1>
        <div className="middle-content">
          <div className="group">
            <label>{i18n.__('Theme')}</label>
            <select ref="theme" defaultValue={theme}>
              <option value="dark">{i18n.__('Dark')}</option>
              <option value="light">{i18n.__('Light')}</option>
            </select>
          </div>
          <div className="group">
            <label>{i18n.__('Language')}</label>
            <select ref="language" defaultValue={config.ui.language}>
              {languages.map(language => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                ref="showCopyNoti"
                defaultChecked={config.ui.showCopyNoti}
              />
              {i18n.__('Show notification when copy')}
            </label>
          </div>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                ref="showDeleteConfirmDialog"
                defaultChecked={config.ui.showDeleteConfirmDialog}
              />
              {i18n.__('Show confirm dialog when delete')}
            </label>
          </div>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                ref="showSnippetCreateTime"
                defaultChecked={config.ui.showSnippetCreateTime}
              />
              {i18n.__('Show snippet create time')}
            </label>
          </div>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                ref="showSnippetUpdateTime"
                defaultChecked={config.ui.showSnippetUpdateTime}
              />
              {i18n.__('Show snippet update time')}
            </label>
          </div>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                ref="showSnippetCopyCount"
                defaultChecked={config.ui.showSnippetCopyCount}
              />
              {i18n.__('Show snippet copy count')}
            </label>
          </div>
          <div className="group">
            <label>{i18n.__('Date format')}</label>
            <input
              type="text"
              ref="dateFormat"
              defaultValue={config.ui.dateFormat}
            />
          </div>
          <div className="group">
            <label>{i18n.__('Snippet list layout')}</label>
            <select ref="layout" defaultValue={config.ui.layout}>
              {layouts.map(layout => (
                <option value={layout.name} key={layout.name}>
                  {i18n.__(layout.label)}
                </option>
              ))}
            </select>
          </div>
          <div className="group">
            <label>{i18n.__('Tag color')}</label>
            <div className="form-group-inline">
              <input
                type="text"
                ref="tagBackground"
                placeholder="background"
                defaultValue={config.ui.tagColor.background}
              />
              <input
                type="text"
                ref="tagForeground"
                placeholder="foreground"
                defaultValue={config.ui.tagColor.foreground}
              />
            </div>
          </div>
        </div>
        <div className="bottom-tool">
          <label className="message success hide" ref="message">
            {i18n.__('Interface setting saved')}
          </label>
          <button onClick={this.saveSetting.bind(this)}>
            {i18n.__('Save')}
          </button>
        </div>
      </div>
    )
  }
}
