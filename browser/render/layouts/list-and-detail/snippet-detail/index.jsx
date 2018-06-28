import React from 'react'
import i18n from 'render/lib/i18n'
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
    return <div className="header">{selectedSnippet.name}</div>
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
