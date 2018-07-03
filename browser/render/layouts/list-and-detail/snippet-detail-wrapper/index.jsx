import React from 'react'
import { observer } from 'mobx-react'
import i18n from 'render/lib/i18n'
import SnippetDetail from '../snippet-detail'
import SnippetDetailMultiFile from '../snippet-detail-multi-file'

@observer
export default class SnippetDetailWrapper extends React.Component {
  renderEmptySnippet () {
    return (
      <h1 className="emptyMessage">{i18n.__('Pick a snippet from list')}</h1>
    )
  }

  render () {
    const { store, config } = this.props
    const { selectedSnippet } = store
    if (!selectedSnippet) {
      return this.renderEmptySnippet()
    }
    if (selectedSnippet.files) {
      return (
        <SnippetDetailMultiFile
          snippet={selectedSnippet}
          store={store}
          config={config}
        />
      )
    } else {
      return (
        <SnippetDetail
          snippet={selectedSnippet}
          store={store}
          config={config}
        />
      )
    }
  }
}
