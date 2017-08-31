import React, { Component } from 'react'
import ControlsContainer from './containers/ControlsContainer'
import DrawerContainer from './containers/DrawerContainer'
import HeaderContainer from './containers/HeaderContainer'
import SequencerContainer from './containers/SequencerContainer'
import { MuiThemeProvider } from 'material-ui/styles'
import theme from './utils/theme'

class App extends Component {
  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <div className='App'>
          <DrawerContainer />
          <HeaderContainer />
          <SequencerContainer />
          <ControlsContainer />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
