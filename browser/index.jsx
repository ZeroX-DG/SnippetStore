import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import SnippetStore from 'store/SnippetStore'

import './render/lib/styles/reset'
import './render/lib/styles/utility'
import './render/lib/icons'
import './render/lib/styles/theme'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/selection/active-line'
import CodeMirror from 'codemirror'

import 'react-toastify/dist/ReactToastify.css'

import Main from './render/main'

// prevent menu from popup when alt pressed
// but still able to toggle menu when only alt is pressed
let isAltPressing = false
let isAltWithMouse = false
let isAltWithOtherKey = false
let isOtherKey = false

document.addEventListener('keydown', function (e) {
  if (e.key === 'Alt') {
    isAltPressing = true
    if (isOtherKey) {
      isAltWithOtherKey = true
    }
  } else {
    if (isAltPressing) {
      isAltWithOtherKey = true
    }
    isOtherKey = true
  }
})

document.addEventListener('mousedown', function (e) {
  if (isAltPressing) {
    isAltWithMouse = true
  }
})

document.addEventListener('keyup', function (e) {
  if (e.key === 'Alt') {
    if (isAltWithMouse || isAltWithOtherKey) {
      e.preventDefault()
    }
    isAltWithMouse = false
    isAltWithOtherKey = false
    isAltPressing = false
    isOtherKey = false
  }
})

var bindings = {
  'Shift-Tab': 'indentLess',
  Tab: 'indentMore',
  'Ctrl-/': 'toggleComment',
  'Ctrl-H': 'replace'
}

for (const binding in bindings) {
  CodeMirror.keyMap.default[binding] = bindings[binding]
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={SnippetStore}>
      <Route path="/" component={Main} />
    </Provider>
  </BrowserRouter>,
  document.getElementById('app')
)
