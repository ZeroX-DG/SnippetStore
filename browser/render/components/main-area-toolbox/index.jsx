import React from 'react'
import SortSnippetTool from '../sort-snippet-tool'
import './main-area-toolbox'

export default class MainAreaToolBox extends React.Component {
  render () {
    const { store } = this.props
    return (
      <div className='list-tools'>
        <SortSnippetTool store={store} />
      </div>
    )
  }
}
