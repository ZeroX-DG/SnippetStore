import React from 'react'
import SnippetItem from '../snippet-item'
import FAIcon from '@fortawesome/react-fontawesome'
import './snippet-list'

export default class SnippetList extends React.Component {
  render () {
    return (
      <div className='snippet-list'>
        <div className='search-bar'>
          <input type='text'/>
          <div className='search-icon'>
            <FAIcon icon='search' />
          </div>
          <button className='create-btn'>
            <div className='icon'>
              <FAIcon icon='plus' />
            </div>
            Create
          </button>
        </div>

        <div className='snippets'>
          <ul>
            <li>
              <SnippetItem
                snippet={{
                  name: 'random code',
                  lang: 'javascript',
                  value: 'sadsad',
                  createAt: 1528103549876,
                  updateAt: 1528103549876,
                  copy: 200
                }}
                config={{theme:'seti', showLineNumber: true}} />
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
