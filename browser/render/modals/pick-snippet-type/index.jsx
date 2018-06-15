import React from 'react'
import ModalSkeleton from '../modal-skeleton'
import i18n from 'render/lib/i18n'
import eventEmitter from 'lib/event-emitter'
import './pick-snippet-type'

export default class PickSnippetType extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: 'pickSnippetTypeModal'
    }
  }

  handleSingleFileSnippetClick () {
    eventEmitter.emit('modal:close', this.state.name)
    eventEmitter.emit('modal:open', 'createSnippetModal')
  }

  handleMultiFileSnippetClick () {
    eventEmitter.emit('modal:close', this.state.name)
    eventEmitter.emit('modal:open', 'createMultiFilesSnippetModal')
  }

  render () {
    i18n.setLocale(this.props.config.ui.language)
    return (
      <ModalSkeleton name={this.state.name} width='600px'>
        <div className='pick-snippet-type'>
          <h2 className='m-b-30'>{i18n.__('Create new snippet')}</h2>
          <div
            className='button'
            onClick={this.handleSingleFileSnippetClick.bind(this)}>
            <h3>{i18n.__('Single-file snippet')}</h3>
            <p>
              {
                i18n.__(
                  'This is the type of snippet where you will only store 1' +
                  ' piece of code. ' +
                  'This type of snippet is suitable for storing small functions'
                )
              }
            </p>
          </div>
          <div
            className='button'
            onClick={this.handleMultiFileSnippetClick.bind(this)}>
            <h3>{i18n.__('Multi-file snippet')}</h3>
            <p>
              {
                i18n.__(
                  'This type of snippet can groups multiple files into 1' +
                  ' snippet and suitable for storing simple code snippet with' +
                  ' more than 1 file'
                )
              }
            </p>
          </div>
        </div>
      </ModalSkeleton>
    )
  }
}
