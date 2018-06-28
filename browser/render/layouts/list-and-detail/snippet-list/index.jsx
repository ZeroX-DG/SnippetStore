import React from 'react'
import SnippetItem from '../snippet-item'
import i18n from 'render/lib/i18n'
import { observer } from 'mobx-react'
import './snippet-list'

@observer
export default class SnippetList extends React.Component {
  renderEmptyMessage () {
    const { config, store } = this.props
    if (store.rawSnippets.length > 0) {
      return <h1 className="emptyMessage">{i18n.__('No snippet found !')}</h1>
    }
    return (
      <h1 className="emptyMessage">
        {i18n.__('Create new snippet using ')}
        {config.keyboard.createSnippet}
      </h1>
    )
  }

  renderSnippetList () {
    const { store } = this.props
    const { snippets } = store
    return (
      <div className="snippets list-and-detail">
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
