import React from 'react'
import CreateSnippetModal from './create-snippet'
import CreateMultiFilesSnippetModal from './create-multi-files-snippet'
import PickSnippetType from './pick-snippet-type'
import SettingModal from './setting'

export default class ModalList extends React.Component {
  render () {
    return (
      <React.Fragment>
        <CreateSnippetModal
          config={this.props.config}
          store={this.props.store}/>
        <CreateMultiFilesSnippetModal
          config={this.props.config}
          store={this.props.store} />
        <SettingModal
          config={this.props.config}
          store={this.props.store} />
        <PickSnippetType
          config={this.props.config}
          store={this.props.store} />
      </React.Fragment>
    )
  }
}
