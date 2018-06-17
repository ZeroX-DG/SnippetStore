import React from 'react'
import CreateSnippetModal from './create-snippet'
import CreateMultiFilesSnippetModal from './create-multi-files-snippet'
import PickSnippetType from './pick-snippet-type'
import SettingModal from './setting'

export default class ModalList extends React.Component {
  render () {
    const { config, store } = this.props
    return (
      <React.Fragment>
        <CreateSnippetModal
          config={config}
          store={store}/>
        <CreateMultiFilesSnippetModal
          config={config}
          store={store} />
        <SettingModal
          config={config}
          store={store} />
        <PickSnippetType
          config={config}
          store={store} />
      </React.Fragment>
    )
  }
}
