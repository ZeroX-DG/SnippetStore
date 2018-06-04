import React from 'react'
import './language-list'

export default class LanguageList extends React.Component {
  render () {
    return (
      <div className='language-list'>
        <p className='language-list-label'>LANGUAGES</p>
        <ul className='languages'>
          <li>
            <div className='icon'>
              <i className='devicon-react-plain colored'></i>
            </div>
            <span className='language-name'>React</span>
            <div className='badge'>20</div>
          </li>
        </ul>
      </div>
    )
  }
}
