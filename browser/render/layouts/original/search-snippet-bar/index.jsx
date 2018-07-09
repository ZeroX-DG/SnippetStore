import React from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import eventEmitter from 'lib/event-emitter'
import './search-snippet-bar'

export default class SearchSnippetBar extends React.Component {
  constructor (props) {
    super(props)
    this.handleSearchLanguage = (event, language) => {
      const newKeyword = `lang:${language}`
      if (this.refs.search) {
        this.refs.search.value = newKeyword
      }
      this.handleSearch(newKeyword)
    }
    this.handleSearchTag = (event, tag) => {
      const newKeyword = `#${tag}`
      if (this.refs.search) {
        this.refs.search.value = newKeyword
      }
      this.handleSearch(newKeyword)
    }
  }

  componentDidMount () {
    eventEmitter.on('languageList:pickLang', this.handleSearchLanguage)
    eventEmitter.on('taglist:pickTag', this.handleSearchTag)
    eventEmitter.on('tag:click', this.handleSearchTag)
  }

  componentWillUnmount () {
    eventEmitter.off('languageList:pickLang', this.handleSearchLanguage)
    eventEmitter.off('taglist:pickTag', this.handleSearchTag)
    eventEmitter.off('tag:click', this.handleSearchTag)
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
