import React from 'react'
import SnippetItem from '../snippet-item'
import i18n from 'render/lib/i18n'
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

  renderEmptyMessage () {
    const { store } = this.props
    if (store.rawSnippets.length > 0) {
      return <h1 className="emptyMessage">{i18n.__('No snippet found !')}</h1>
    }
    return ''
  }

  renderSnippetList () {
    const { store } = this.props
    const { snippets } = store
    return (
      <div className="snippets list-and-detail">
        <div className="wall" ref="wall" />
        <ul>
          {snippets.map(snippet => (
            <li key={snippet.key}>
              <SnippetItem store={store} snippet={snippet} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render () {
    const { snippets } = this.props.store
    return snippets.length > 0
      ? this.renderSnippetList()
      : this.renderEmptyMessage()
  }
}
