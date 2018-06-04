import React from 'react'
import './side-bar'
import LanguageList from '../language-list'
import SideBarToolBox from '../side-bar-toolbox'

export default class SideBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isMouseDownResize: false
    }
  }

  componentDidMount () {
    this.refs.resizer.addEventListener('mousedown', () => {
      this.setState({ isMouseDownResize: true })
    })

    document.addEventListener('mouseup', () => {
      this.setState({ isMouseDownResize: false })
    })

    document.addEventListener('mousemove', e => {
      const root = this.refs.root
      if (this.state.isMouseDownResize) {
        const newWidth = e.pageX - root.getBoundingClientRect().left
        root.style.width = newWidth + 'px'
      }
    })
  }

  render () {
    return (
      <div className='sidebar' ref='root'>
        <div className='resizer' ref='resizer'></div>
        <SideBarToolBox />
        <LanguageList />
      </div>
    )
  }
}
