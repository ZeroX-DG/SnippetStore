import React from 'react'

export default class InterfaceTab extends React.Component {
  render () {
    return (
      <div className='interface-tab'>
        <h1 className='tab-title'>Interface</h1>
        <div className='group'>
          <label>Theme</label>
          <input type='text' ref='theme' />
        </div>
        <div className='bottom-tool'></div>
      </div>
    )
  }
}
