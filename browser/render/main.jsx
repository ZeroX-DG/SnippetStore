import React from 'react'
import SideBar from './components/side-bar'
import SnippetList from './components/snippet-list'

export default class Main extends React.Component {
  componentDidMount () {
    document.body.setAttribute('data-theme', 'dark')
  }

  render () {
    return (
      <div className='wrapper'>
        <SideBar />
        <SnippetList />
      </div>
    )
  }
}
