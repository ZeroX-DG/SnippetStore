import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import i18n from 'render/lib/i18n'
import CodeMirror from 'codemirror'
import 'codemirror/mode/meta'
import 'codemirror/addon/display/autorefresh'

export default class SnippetItemMultiFiles extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false
    }
  }

  renderHeader () {
    const { isEditing } = this.state
    const { snippet } = this.props
    return (
      <div className='header'>
        <div className='info'>
          {
            isEditing
              ? <input type='text' ref='name' defaultValue={snippet.name} />
              : snippet.name
          }
        </div>
        <div className='tools'>
          {
            isEditing &&
            <select ref='lang' onChange={this.handleSnippetLangChange.bind(this)} defaultValue={snippet.lang}>
              {
                CodeMirror.modeInfo.map((mode, index) => (
                  <option
                    value={mode.name}
                    key={index}>
                    {mode.name}
                  </option>
                ))
              }
            </select>
          }
          <div
            className='copy-btn'
            data-tip={ i18n.__('copy') }
            onClick={this.copySnippet.bind(this)}>
            <FAIcon icon='copy'/>
          </div>
          {
            isEditing
              ? <div
                className='save-btn'
                data-tip={ i18n.__('save changes') }
                onClick={this.handleSaveChangesClick.bind(this)}>
                <FAIcon icon='check'/>
              </div>
              : <div
                className='edit-btn'
                data-tip={ i18n.__('edit') }
                onClick={this.handleEditButtonClick.bind(this)}>
                <FAIcon icon='edit'/>
              </div>
          }
          <div
            className='delete-btn'
            data-tip={ i18n.__('delete snippet') }
            onClick={this.handleDeleteClick.bind(this)}>
            <FAIcon icon='trash-alt'/>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='snippet-item-multi-files'>
        <ReactTooltip place='bottom' effect='solid' />
        { this.renderHeader() }
        { this.renderTagList() }
        { this.renderDescription() }
        <div className='code' ref='editor'></div>
        { this.renderFooter() }
      </div>
    )
  }
}
