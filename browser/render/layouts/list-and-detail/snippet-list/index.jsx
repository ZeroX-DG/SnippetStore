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
    eventEmitter.on('snippet-list:previous', () => {
      const { snippets, selectedSnippet } = this.props.store
      if (selectedSnippet) {
        for (let i = 0; i < snippets.length; i++) {
          if (snippets[i].key === selectedSnippet.key) {
            // previous of the i-th snippet is i - 1
            let previousIndex = i - 1
            if (previousIndex < 0) {
              previousIndex = snippets.length - 1
            }
            this.props.store.selectedSnippet = snippets[previousIndex]
            break
          }
        }
      } else {
        this.props.store.selectedSnippet = snippets[0]
      }
    })
    eventEmitter.on('snippet-list:next', () => {
      const { snippets, selectedSnippet } = this.props.store
      if (selectedSnippet) {
        for (let i = 0; i < snippets.length; i++) {
          if (snippets[i].key === selectedSnippet.key) {
            // the next snippet of the i-th snippet is i + 1
            let nextIndex = i + 1
            if (nextIndex > snippets.length - 1) {
              nextIndex = 0
            }
            this.props.store.selectedSnippet = snippets[nextIndex]
            break
          }
        }
      } else {
        this.props.store.selectedSnippet = snippets[0]
      }
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
