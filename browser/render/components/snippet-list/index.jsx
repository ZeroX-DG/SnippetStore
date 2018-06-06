import React from 'react'
import SnippetItem from '../snippet-item'
import eventEmitter from 'lib/event-emitter'
import FAIcon from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import './snippet-list'

@observer
export default class SnippetList extends React.Component {
  handleCreateSnippetClick () {
    eventEmitter.emit('modal:open', 'createSnippetModal')
  }

  renderSnippetList () {
    const { snippets } = this.props.store
    const { config } = this.props
    return (
      snippets.length > 0 &&
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
    const { config } = this.props
    return (
      <h1 align='center' style={{ marginTop: '200px', color: 'rgba(255, 255, 255, 0.3)'}}>
        Create new snippet using { config.keyboard.createSnippet }
      </h1>
    )
  }

  render () {
    const { snippets } = this.props.store
    return (
      <div className='snippet-list'>
        <div className='search-bar'>
          <input type='text'/>
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

        {
          snippets.length > 0
            ? this.renderSnippetList()
            : this.renderEmptyMessage()
        }
      </div>
    )
  }
}
