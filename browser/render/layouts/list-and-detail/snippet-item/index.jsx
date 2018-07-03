import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import i18n from 'render/lib/i18n'
import formatDate from 'lib/date-format'
import ContextMenu from 'render/lib/context-menu'
import _ from 'lodash'
import './snippet-item'

export default class SnippetItem extends React.Component {
  pickSnippet () {
    const { store, snippet } = this.props
    store.selectedSnippet = snippet
  }

  handleContextMenu () {
    const { config, store, snippet } = this.props
    ContextMenu.popup([
      {
        label: i18n.__('delete snippet'),
        click () {
          if (config.ui.showDeleteConfirmDialog) {
            if (!confirm(i18n.__('Are you sure to delete this snippet?'))) {
              return
            }
          }
          const newSnippet = _.clone(snippet)
          store.deleteSnippet(newSnippet)
          store.selectedSnippet = null
        }
      }
    ])
  }

  render () {
    const { snippet, selected } = this.props
    return (
      <div
        className={`snippet-item list-and-detail ${selected ? 'selected' : ''}`}
        onContextMenu={() => this.handleContextMenu(snippet)}
        onClick={() => this.pickSnippet()}
      >
        <p className="name">
          <span className="icon">
            {snippet.files ? (
              <FAIcon icon="copy" />
            ) : (
              <FAIcon icon="file-code" />
            )}
          </span>
          {snippet.name}
        </p>
        <p className="m-t-10">
          {i18n.__('Create at')} : {formatDate(snippet.createAt)}
        </p>
        <p className="m-t-5">
          {i18n.__('Last update')} : {formatDate(snippet.updateAt)}
        </p>
      </div>
    )
  }
}
