import React, { Component } from 'react'
// import './App.css'
// import logo from './logo.svg'
import Header from './components/Header'
import Sequencer from './components/Sequencer'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Header />
        <Sequencer />
      </div>
    )
  }
}

export default App
