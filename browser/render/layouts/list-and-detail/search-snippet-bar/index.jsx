import React from 'react'
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
  }

  componentWillUnmount () {
    eventEmitter.off('languageList:pickLang', this.handleSearchLanguage)
    eventEmitter.off('taglist:pickTag', this.handleSearchTag)
  }

  handleCreateSnippetClick () {
    eventEmitter.emit('modal:open', 'pickSnippetTypeModal')
  }

  handleSearch (keyword) {
    this.props.store.filter = keyword
  }

  render () {
    return (
      <div className="search-snippet-bar">
        <input
          type="text"
          id="search"
          placeholder="Search"
          ref="search"
          onChange={e => this.handleSearch(e.target.value)}
        />
        <span className="new-snippet" onClick={this.handleCreateSnippetClick}>
          <FAIcon icon="plus" />
        </span>
      </div>
    )
  }
}
