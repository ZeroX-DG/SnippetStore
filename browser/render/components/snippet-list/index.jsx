import React from 'react'
import SnippetItem from '../snippet-item'
import eventEmitter from 'lib/event-emitter'
import FAIcon from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import './snippet-list'

@observer
export default class SnippetList extends React.Component {
  componentDidMount () {
    eventEmitter.on('languageList:pickLang', (event, language) => {
      const newKeyword = `lang:${language}`
      this.refs.search.value = newKeyword
      this.handleSearch(newKeyword)
    })
  }

  handleCreateSnippetClick () {
    eventEmitter.emit('modal:open', 'createSnippetModal')
  }

  renderSnippetList () {
    const { snippets } = this.props.store
    const { config } = this.props
    return (
      <div className='snippets'>
        <ul>
          {
            snippets.map(snippet => (
              <li key={snippet.key}>
                <SnippetItem
                  snippet={snippet}
                  config={config}
                  store={store}/>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }

  renderEmptyMessage () {
    const { config, store } = this.props
    if (store.rawSnippets.length > 0) {
      return (
        <h1 className='emptyMessage'>
          No snippet found !
        </h1>
      )
    }
    return (
      <h1 className='emptyMessage'>
        Create new snippet using { config.keyboard.createSnippet }
      </h1>
    )
  }

  handleSearch (keyword) {
    this.props.store.filter = keyword
  }

  handleSort (type) {
    this.props.store.sort = type
  }

  render () {
    const { snippets } = this.props.store
    return (
      <div className='snippet-list'>
        <div className='search-bar'>
          <input type='text' ref='search' onChange={e => this.handleSearch(e.target.value)} />
          <div className='search-icon'>
            <FAIcon icon='search' />
          </div>
          <button className='create-btn' onClick={this.handleCreateSnippetClick}>
            <div className='icon'>
              <FAIcon icon='plus' />
            </div>
            Create
          </button>
        </div>
        <div className='list-tools'>
          <span className='m-r-10'>SORT:</span>
          <select onChange={e => this.handleSort(e.target.value)}>
            <option value='createTimeNewer'>Sort by create time (newest)</option>
            <option value='createTimeOlder'>Sort by create time (oldest)</option>
            <option value='updateTimeNewer'>Sort by update time (newest)</option>
            <option value='updateTimeOlder'>Sort by update time (oldest)</option>
            <option value='copyCountAsc'>Sort by copy count (ascending)</option>
            <option value='copyCountDesc'>Sort by copy count (descending)</option>
          </select>
        </div>
        {
          snippets.length > 0
            ? this.renderSnippetList()
            : this.renderEmptyMessage()
        }
      </div>
    )
  }
}
