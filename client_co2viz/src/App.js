import React, { Component } from 'react'
import './App.css'
import { ThemeProvider } from 'styled-components'

import Home from './components/Home'
import CoreLayout from './components/CoreLayout'

const origTheme = {
  primaryColor: '#8e8e90',
  primaryColorDark: '#49494b',
  accentColor: '#bd8c7d'
}

const coolTheme = {
  primaryColorPink: '#e66465',
  primaryColorBlue: '#9198e5',
  accentColor: '#e66465',
  darkBG: '#00000073'
}

class App extends Component {
  render() {
    return (
      <div id="root">
        <ThemeProvider theme={coolTheme}>
          <CoreLayout>
            <Home />
          </CoreLayout>
        </ThemeProvider>
      </div>
    )
  }
}

export default App
