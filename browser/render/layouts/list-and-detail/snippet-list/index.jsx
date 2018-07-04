import React from 'react'
import SnippetItem from '../snippet-item'
import SearchSnippetBar from '../search-snippet-bar'
import SortSnippetTool from '../sort-snippet-tool'
import eventEmitter from 'lib/event-emitter'
import { observer } from 'mobx-react'
import './snippet-list'

@observer
export default class SnippetList extends React.Component {
  componentDidMount () {
    eventEmitter.on('snippet-detail:edit-start', () => {
      this.refs.wall.style.display = 'block'
    })
    eventEmitter.on('snippet-detail:edit-end', () => {
      this.refs.wall.style.display = 'none'
    })
  }

  renderSnippetList () {
    const { store, config } = this.props
    const { snippets, selectedSnippet } = store
    return (
      <div className="snippets list-and-detail">
        <div className="wall" ref="wall" />
        <SearchSnippetBar store={store} />
        <SortSnippetTool store={store} />
        <ul>
          {snippets.map(snippet => (
            <li key={snippet.key}>
              <SnippetItem
                selected={
                  selectedSnippet && selectedSnippet.key === snippet.key
                }
                store={store}
                config={config}
                snippet={snippet}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render () {
    return this.renderSnippetList()
  }
}
