import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import i18n from 'render/lib/i18n'
import './pick-snippet-type'

export default class PickSnippetType extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'pickSnippetTypeModal'
    }
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name='pickSnippetTypeModal' width='600px'>
        <div className='pick-snippet-type'>
          <h2 className='m-b-30'>Create new snippet</h2>
          <div className='button'>
            <h3>Single-file snippet</h3>
            <p>
              This is the type of snippet where you will only store 1 piece of
              code. This type of snippet is suitable for storing small functions
            </p>
          </div>
          <div className='button'>
            <h3>Multi-file snippet</h3>
            <p>
              This type of snippet can groups multiple files into 1 snippet and
              suitable for storing simple code snippet with more than 1 file
            </p>
          </div>
        </div>
      </ModalSkeleton>
    )
  }
}
