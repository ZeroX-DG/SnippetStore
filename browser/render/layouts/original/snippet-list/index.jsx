import React from 'react'
import SnippetItem from '../snippet-item'
import SnippetItemMultiFiles from '../snippet-item-multi-files'
import i18n from 'render/lib/i18n'
import { observer } from 'mobx-react'
import './snippet-list'

@observer
export default class SnippetList extends React.Component {
  renderMultiFileSnippet (snippet) {
    const { config, store } = this.props
    return (
      <SnippetItemMultiFiles snippet={snippet} config={config} store={store} />
    )
  }

  renderSingleFileSnippet (snippet) {
    const { config, store } = this.props
    return <SnippetItem snippet={snippet} config={config} store={store} />
  }

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
    const { snippets } = this.props.store
    return (
      <div className="snippets">
        <ul>
          {snippets.map(snippet => (
            <li key={snippet.key}>
              {snippet.files === undefined
                ? this.renderSingleFileSnippet(snippet)
                : this.renderMultiFileSnippet(snippet)}
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
