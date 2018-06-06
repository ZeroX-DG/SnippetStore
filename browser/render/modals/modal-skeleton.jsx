import React from 'react'
import eventEmitter from 'lib/event-emitter'
import FAIcon from '@fortawesome/react-fontawesome'
import './modal'

export default class ModalSkeleton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }

  closeModal () {
    eventEmitter.emit('modal:onClose', this.props.name)
    this.setState({ isOpen: false })
  }

  componentDidMount () {
    eventEmitter.on('modal:open', (event, modalName) => {
      if (this.props.name === modalName) {
        this.setState({ isOpen: true })
      }
    })

    eventEmitter.on('modal:close', (event, modalName) => {
      if (this.props.name === modalName) {
        this.setState({ isOpen: false })
      }
    })
  }

  render () {
    const { isOpen } = this.state
    return (
      <div className='modal-overlay' style={{display: isOpen ? 'flex' : 'none'}}>
        <div className='modal'>
          <div className='close-btn' onClick={this.closeModal.bind(this)}>
            <FAIcon icon='times' />
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
