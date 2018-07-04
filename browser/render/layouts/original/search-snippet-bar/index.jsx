import React from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import eventEmitter from 'lib/event-emitter'
import './search-snippet-bar'

export default class SearchSnippetBar extends React.Component {
  componentDidMount () {
    eventEmitter.on('languageList:pickLang', (event, language) => {
      const newKeyword = `lang:${language}`
      if (this.refs.search) {
        this.refs.search.value = newKeyword
      }
      this.handleSearch(newKeyword)
    })

    eventEmitter.on('taglist:pickTag', (event, tag) => {
      const newKeyword = `#${tag}`
      if (this.refs.search) {
        this.refs.search.value = newKeyword
      }
      this.handleSearch(newKeyword)
    })
  }

  handleSearch (keyword) {
    this.props.store.filter = keyword
  }

  renderCreateSnippetButton () {
    return (
      <button className="create-btn" onClick={this.handleCreateSnippetClick}>
        <div className="icon">
          <FAIcon icon="plus" />
        </div>
        {i18n.__('Create')}
      </button>
    )
  }

  handleCreateSnippetClick () {
    eventEmitter.emit('modal:open', 'pickSnippetTypeModal')
  }

  render () {
    return (
      <div className="search-bar">
        <input
          type="text"
          ref="search"
          onChange={e => this.handleSearch(e.target.value)}
        />
        <div className="search-icon">
          <FAIcon icon="search" />
        </div>
        {this.renderCreateSnippetButton()}
      </div>
    )
  }
}
