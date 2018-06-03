import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import './render/lib/styles/reset'
import './render/lib/styles/utility'
import './render/lib/icons'

import Main from './render/main'

ReactDOM.render(
  <BrowserRouter>
    <Route path='/' component={Main} />
  </BrowserRouter>,
  document.getElementById('app')
)
