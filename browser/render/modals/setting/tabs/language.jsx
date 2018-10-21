import React from 'react'
import i18n from 'render/lib/i18n'
import ConfigManager from 'lib/config-manager'
import { pageView, trackEvent } from 'lib/analytics'

export default class LanguageTab extends React.Component {
  componentDidMount () {
    pageView('/setting/language')
  }
  saveSetting () {
    const newSetting = {
      language: {
        php: {
          requireOpenTag: this.refs.phpRequireOpenTag.checked
        }
      }
    }
    ConfigManager.set(newSetting)
    trackEvent('user interaction', 'save setting', 'language')
  }

  render () {
    const { config } = this.props
    const langConf = config.language
    return (
      <div className="editor-tab">
        <h1 className="tab-title">{i18n.__('Programming Language')}</h1>
        <div className="middle-content">
          <h2 style={{ marginBottom: '10px' }}>PHP</h2>
          <div className="group-checkbox">
            <label>
              <input
                type="checkbox"
                defaultChecked={langConf.php.requireOpenTag}
                onChange={this.saveSetting.bind(this)}
                ref="phpRequireOpenTag"
              />
              {i18n.__('Require open tag')}
            </label>
          </div>
        </div>
      </div>
    )
  }
}
