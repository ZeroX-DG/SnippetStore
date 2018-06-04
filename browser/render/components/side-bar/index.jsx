import React from 'react'
import './side-bar'
import LanguageList from '../language-list'
import SideBarToolBox from '../side-bar-toolbox'

export default class SideBar extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className='sidebar' ref='root'>
        <SideBarToolBox />
        <LanguageList />
      </div>
    )
  }
}
