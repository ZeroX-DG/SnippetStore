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
  render () {
    const { snippets } = this.props.store
    const { config } = this.props
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

        <div className='snippets'>
          <ul>
            {
              snippets.map(snippet => (
                <li key={snippet.key}>
                  <SnippetItem
                    snippet={snippet}
                    config={config} />
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}
