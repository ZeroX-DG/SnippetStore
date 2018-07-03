import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import eventEmitter from 'lib/event-emitter'
import './search-snippet-bar'

export default class SearchSnippetBar extends React.Component {
  componentDidMount () {
    eventEmitter.on('languageList:pickLang', (event, language) => {
      const newKeyword = `lang:${language}`
      this.refs.search.value = newKeyword
      this.handleSearch(newKeyword)
    })

    eventEmitter.on('taglist:pickTag', (event, tag) => {
      const newKeyword = `#${tag}`
      this.refs.search.value = newKeyword
      this.handleSearch(newKeyword)
    })
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
