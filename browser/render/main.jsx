import React from 'react'
import SideBar from './components/side-bar'

export default class Main extends React.Component {
  componentDidMount () {
    document.body.setAttribute('data-theme', 'dark')
  }

  render () {
    return (
      <div className='wrapper'>
        <SideBar />
      </div>
    )
  }
}
