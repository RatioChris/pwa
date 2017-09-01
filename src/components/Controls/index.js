import React, { Component } from 'react'
import './styles.css'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Button from 'material-ui/Button'
import PlayIcon from 'material-ui-icons/PlayArrow'
import PauseIcon from 'material-ui-icons/Pause'
import Radio from 'material-ui/Radio'
import Switch from 'material-ui/Switch'
import TextField from 'material-ui/TextField'

class Controls extends Component {
  constructor (props) {
    super(props)

    this.onPlayPause = this.onPlayPause.bind(this)
    this.onSetBpm = this.onSetBpm.bind(this)
    this.onSetInstrument = this.onSetInstrument.bind(this)
    this.onSetSolo = this.onSetSolo.bind(this)
  }

  onPlayPause () {
    const paused = this.props.session.paused
    this.props.onPlayPause(!paused)
  }

  onSetBpm (val) {
    if (val < 20) val = 20
    if (val > 200) val = 200
    this.props.onSetBpm(val)
  }

  onSetInstrument (event) {
    const instrument = event.currentTarget.value
    this.props.onSetInstrument(instrument)
  }

  onSetSolo (event) {
    // const solo = event.currentTarget.value
    // console.log(event, solo, event.currentTarget.checked)
    // this.props.onSetSolo(solo)

    const solo = this.props.session.solo
    console.log(event, solo, event.currentTarget.checked)
    this.props.onSetSolo(!solo)
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
          <FormGroup row className='controls--group'>
            <Button fab
              className='controls--button'
              color='primary'
              onClick={this.onPlayPause}
            >
              {icon}
            </Button>
          </FormGroup>

          <FormGroup row className='controls--group'>
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

          <FormGroup row className='controls--group'>
            <FormControlLabel
              control={
                <Switch
                  checked={session.solo}
                  onChange={this.onSetSolo}
                />
              }
              label='Solo'
            />
          </FormGroup>

          <FormGroup row className='controls--group'>
            <TextField className='controls--bpm'
              id='bpm'
              label='BPM'
              type='number'
              value={session.bpm}
              onChange={e => this.onSetBpm(e.target.value)}
              margin='none'
            />
          </FormGroup>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Controls
