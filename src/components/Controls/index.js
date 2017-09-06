import React, { Component } from 'react'
import './styles.css'

import AppBar from 'material-ui/AppBar'
import Button from 'material-ui/Button'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Radio, { RadioGroup } from 'material-ui/Radio'
import Switch from 'material-ui/Switch'
import TextField from 'material-ui/TextField'
import Toolbar from 'material-ui/Toolbar'
import PauseIcon from 'material-ui-icons/Pause'
import PlayIcon from 'material-ui-icons/PlayArrow'

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
    const solo = this.props.session.solo
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
              aria-label='play'
            >
              {icon}
            </Button>
          </FormGroup>

          <RadioGroup row
            className='controls--group'
            name='instrument'
            aria-label='instrument'
            value={session.instrument}
            onChange={this.onSetInstrument}
          >
            <FormControlLabel
              value='guitar'
              label='Guitar'
              control={<Radio checked={session.instrument === 'guitar'} />}
            />

            <FormControlLabel
              value='bass'
              label='Bass'
              control={<Radio checked={session.instrument === 'bass'} />}
            />

            <FormControlLabel
              value='drums'
              label='Drums'
              control={<Radio checked={session.instrument === 'drums'} />}
            />
          </RadioGroup>

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
            <TextField
              className='controls--bpm'
              id='bpm'
              label='BPM'
              aria-label='beats per minute'
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
