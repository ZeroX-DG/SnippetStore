import React from 'react'
import { observer } from 'mobx-react'
import './language-list'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'

@observer
export default class LanguageList extends React.Component {
  render () {
    const { languages } = this.props.store
    return (
      <div className='language-list'>
        <p className='language-list-label'>LANGUAGES</p>
        <ul className='languages'>
          {
            Object.keys(languages).map((language, index) => {
              const snippetMode = CodeMirror.findModeByName(language).mode
              return (
                <li key={index}>
                  <div className='icon'>
                    <i className={`devicon-${snippetMode}-plain colored`}></i>
                  </div>
                  <span className='language-name'>{ language }</span>
                  <div className='badge'>{ languages[language] }</div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}
