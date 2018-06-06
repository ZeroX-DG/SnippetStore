import React from 'react'
import CreateSnippetModal from './create-snippet'
import SettingModal from './setting'

export default class ModalList extends React.Component {
  render () {
    return (
      <React.Fragment>
        <CreateSnippetModal config={this.props.config} store={this.props.store} />
        <SettingModal config={this.props.config} store={this.props.store} />
      </React.Fragment>
    )
  }
}
