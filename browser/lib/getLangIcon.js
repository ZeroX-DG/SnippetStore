import React from 'react'
import getDevIcon from 'lib/get-dev-icon.js'
import defaultLanguageIcon from 'resources/image/defaultLanguageIcon.png'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'

export default function getLanguageIcon (lang) {
  let languageIcon = <img src={defaultLanguageIcon} className="lang-icon" />
  const langMode = CodeMirror.findModeByName(lang)
  if (langMode) {
    let langName = langMode.name.toLowerCase()
    if (langName === 'c++') {
      langName = 'cpp'
    } else if (langName === 'jsx') {
      langName = 'react'
    } else if (langName === 'github flavored markdown') {
      langName = 'markdown'
    }
    try {
      const svgIcon = getDevIcon(`./${langName}.svg`)
      if (svgIcon) {
        languageIcon = (
          <span
            className="lang-icon"
            dangerouslySetInnerHTML={{ __html: svgIcon }}
          />
        )
      }
    } catch (error) {}
  }
  return languageIcon
}
