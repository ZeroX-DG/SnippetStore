import React from 'react'
import { observer } from 'mobx-react'
import './language-list'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import getDevIcon from 'lib/get-dev-icon.js'
import defaultLanguageIcon from 'resources/image/defaultLanguageIcon.png'
import eventEmitter from 'lib/event-emitter'
import { trackEvent } from 'lib/analytics'
import i18n from 'render/lib/i18n'

@observer
export default class LanguageList extends React.Component {
  handleLanguageClick (lang) {
    eventEmitter.emit('languageList:pickLang', lang)
    trackEvent('user interaction', 'use languagelist')
  }

  getLanguageIcon (lang) {
    let languageIcon = <img src={defaultLanguageIcon} className="lang-icon" />
    const langMode = CodeMirror.findModeByName(lang)
    if (langMode) {
      const svgIcon = getDevIcon(`./${langMode.name.toLowerCase()}.svg`)
      if (svgIcon) {
        languageIcon = (
          <span
            className="lang-icon"
            dangerouslySetInnerHTML={{ __html: svgIcon }}
          />
        )
      }
    }
    return languageIcon
  }

  render () {
    const { config, store } = this.props
    const { languages } = store
    i18n.setLocale(config.ui.language)
    return (
      <div className="language-list">
        <div className="language-list-label">
          {i18n.__('LANGUAGES')}
          <div className="badge">{Object.keys(languages).length}</div>
        </div>
        <ul className="languages">
          {Object.keys(languages).map((language, index) => {
            const languageIcon = this.getLanguageIcon(language)
            return (
              <li
                key={index}
                onClick={() => this.handleLanguageClick(language)}
              >
                <div className="icon">{languageIcon}</div>
                <span className="language-name">{language}</span>
                <div className="badge">{languages[language]}</div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
