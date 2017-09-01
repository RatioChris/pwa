import React, { Component } from 'react'
import './styles.css'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Button from 'material-ui/Button'
import PlayIcon from 'material-ui-icons/PlayArrow'
import PauseIcon from 'material-ui-icons/Pause'
import Radio from 'material-ui/Radio'

class Controls extends Component {
  constructor (props) {
    super(props)

    this.onPlayPause = this.onPlayPause.bind(this)
    this.onSetInstrument = this.onSetInstrument.bind(this)
  }

  onPlayPause () {
    const paused = this.props.session.paused
    this.props.onPlayPause(!paused)
  }

  onSetInstrument (event) {
    const instrument = event.currentTarget.value
    this.props.onSetInstrument(instrument)
  }

  render () {
    const session = this.props.session || {}
    let icon = null

    if (session.paused) {
      icon = <PlayIcon />
    } else {
      icon = <PauseIcon />
    }

    return (
      <AppBar position='static' color='default' className='controls'>
        <Toolbar className='controls--toolbar'>
          <Button fab className='controls--button'
            color='primary'
            onClick={this.onPlayPause}
          >
            {icon}
          </Button>

          <FormGroup row>
            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='guitar'
                  checked={session.instrument === 'guitar'}
                  onChange={this.onSetInstrument}
                />
              }
              label='Guitar'
            />

            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='bass'
                  checked={session.instrument === 'bass'}
                  onChange={this.onSetInstrument}
                />
              }
              label='Bass'
            />

            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='drums'
                  checked={session.instrument === 'drums'}
                  onChange={this.onSetInstrument}
                />
              }
              label='Drums'
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Controls
