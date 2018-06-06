import React from 'react'

export default class InterfaceTab extends React.Component {
  render () {
    return (
      <div className='interface-tab'>
        <h1 className='tab-title'>Interface</h1>
        <div className='middle-content'>
          <div className='group'>
            <label>Theme</label>
            <select>
              <option value='dark'>Dark</option>
              <option value='light'>Light</option>
            </select>
          </div>
          <div className='group'>
            <label>Language</label>
            <select>
              <option value='dark'>English</option>
              <option value='light'>Tiếng Việt</option>
            </select>
          </div>
          <div className='group-checkbox'>
            <label><input type='checkbox' />Show notification when copy</label>
          </div>
          <div className='group-checkbox'>
            <label><input type='checkbox' />Show confirm dialog when delete</label>
          </div>
          <div className='group-checkbox'>
            <label><input type='checkbox' />Show snippet create date</label>
          </div>
          <div className='group-checkbox'>
            <label><input type='checkbox' />Show snippet update date</label>
          </div>
          <div className='group-checkbox'>
            <label><input type='checkbox' />Show snippet copy times</label>
          </div>
          <div className='group'>
            <label>Date format</label>
            <input type='text'/>
          </div>
        </div>
        <div className='bottom-tool'>
          <label className='message success'>Interface setting saved</label>
          <button>Save</button>
        </div>
      </div>
    )
  }
}
