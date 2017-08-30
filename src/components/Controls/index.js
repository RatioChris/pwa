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
  render () {
    let icon = null
    if (this.props.paused) {
      icon = <PlayIcon />
    } else {
      icon = <PauseIcon />
    }

    return (
      <AppBar position='static' color='default' className='controls'>
        <Toolbar className='controls--toolbar'>
          <Button fab className='controls--button'
            color='primary'
            onClick={this.props.onTogglePlay}
          >
            {icon}
          </Button>

          <FormGroup row>
            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='guitar'
                  checked={this.props.instrument === 'guitar'}
                  onChange={this.props.onSelectInstrument}
                />
              }
              label='Guitar'
            />

            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='bass'
                  checked={this.props.instrument === 'bass'}
                  onChange={this.props.onSelectInstrument}
                />
              }
              label='Bass'
            />

            <FormControlLabel
              control={
                <Radio
                  name='instrument'
                  value='drums'
                  checked={this.props.instrument === 'drums'}
                  onChange={this.props.onSelectInstrument}
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
