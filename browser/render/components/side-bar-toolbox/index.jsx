import React from 'react'
import FAIcon from '@fortawesome/react-fontawesome'
import './side-bar-toolbox'

export default class SideBarToolBox extends React.Component {
  render () {
    return (
      <div className='sidebar-toolbox'>
        <FAIcon icon='cog' />
      </div>
    )
  }
}
