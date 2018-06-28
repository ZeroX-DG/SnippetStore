import React from 'react'
import i18n from 'render/lib/i18n'
import FAIcon from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import './snippet-detail'

@observer
export default class SnippetDetail extends React.Component {
  renderEmptySnippet () {
    return (
      <h1 className="emptyMessage">{i18n.__('Pick a snippet from list')}</h1>
    )
  }

  renderSnippet () {
    const { selectedSnippet } = this.props.store
    return (
      <div>
        <div className="header">
          <p className="snippet-name">{selectedSnippet.name}</p>
        </div>
        <p className="tags">
          <span className="icon">
            <FAIcon icon="tags" />
          </span>
          {selectedSnippet.tags.join(', ')}
        </p>
        <p className="description">{selectedSnippet.description}</p>
      </div>
    )
  }

  render () {
    const { selectedSnippet } = this.props.store
    return (
      <div className="snippet-detail">
        {!selectedSnippet && this.renderEmptySnippet()}
        {selectedSnippet && this.renderSnippet()}
      </div>
    )
  }
}
