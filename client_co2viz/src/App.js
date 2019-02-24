import React, { Component } from 'react'
import './App.css'
import 'react-virtualized-select/styles.css'

import { ThemeProvider } from 'styled-components'

import Home from './components/Home'
import CoreLayout from './components/CoreLayout'

const theme = {
  primaryColor: '#8e8e90',
  primaryColorDark: '#49494b',
  accentColor: '#bd8c7d'
}

class App extends Component {
  render() {
    return (
      <div id="root">
        <ThemeProvider theme={theme}>
          <CoreLayout>
            <Home />
          </CoreLayout>
        </ThemeProvider>
      </div>
    )
  }
}

export default App
