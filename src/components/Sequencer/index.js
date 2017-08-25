import React, { Component } from 'react'
import Tone from 'tone'
import _ from 'underscore'
import './styles.css'
import Instruments from '../../utils/Instruments'

import Button from 'material-ui/Button'
import PlayIcon from 'material-ui-icons/PlayArrow'
import PauseIcon from 'material-ui-icons/Pause'
import Radio from 'material-ui/Radio'

let sequencer
let measures = 8
let beatsPerMeasure = 4
let instruments = new Instruments(measures, beatsPerMeasure)
let bass = null
let guitar = null
let synth = null

class Sequencer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      paused: false,
      inst: 'guitar'
    }

    // this.arrMatrix = [{'row': 0, 'column': 0}, {'row': 3, 'column': 2}, {'row': 5, 'column': 4}, {'row': 0, 'column': 7}, {'row': 0, 'column': 16}, {'row': 3, 'column': 18}, {'row': 5, 'column': 20}, {'row': 3, 'column': 9}, {'row': 6, 'column': 11}, {'row': 5, 'column': 12}, {'row': 3, 'column': 23}, {'row': 0, 'column': 25}]
    // this.arrMatrix = [{'row': 0, 'column': 0}, {'row': 3, 'column': 2}, {'row': 5, 'column': 4}, {'row': 0, 'column': 7}, {'row': 0, 'column': 16}, {'row': 3, 'column': 18}, {'row': 5, 'column': 20}, {'row': 3, 'column': 9}, {'row': 6, 'column': 11}, {'row': 5, 'column': 12}, {'row': 3, 'column': 23}, {'row': 0, 'column': 25}, {'row': 7, 'column': 0}, {'row': 10, 'column': 2}, {'row': 12, 'column': 4}, {'row': 7, 'column': 7}, {'row': 10, 'column': 9}, {'row': 13, 'column': 11}, {'row': 12, 'column': 12}, {'row': 10, 'column': 18}, {'row': 12, 'column': 20}, {'row': 7, 'column': 16}, {'row': 10, 'column': 23}, {'row': 7, 'column': 25}, {'row': 0, 'column': 2}, {'row': 0, 'column': 4}, {'row': 0, 'column': 6}, {'row': 0, 'column': 18}, {'row': 0, 'column': 20}, {'row': 0, 'column': 8}, {'row': 0, 'column': 10}, {'row': 0, 'column': 12}, {'row': 0, 'column': 14}, {'row': 0, 'column': 30}, {'row': 0, 'column': 28}, {'row': 0, 'column': 26}, {'row': 0, 'column': 24}, {'row': 0, 'column': 22}]
    this.arrGuitar = [{'row': 0, 'column': 0, 'inst': 'guitar'}, {'row': 7, 'column': 0, 'inst': 'guitar'}, {'row': 3, 'column': 2, 'inst': 'guitar'}, {'row': 10, 'column': 2, 'inst': 'guitar'}, {'row': 5, 'column': 4, 'inst': 'guitar'}, {'row': 12, 'column': 4, 'inst': 'guitar'}, {'row': 0, 'column': 7, 'inst': 'guitar'}, {'row': 7, 'column': 7, 'inst': 'guitar'}, {'row': 3, 'column': 9, 'inst': 'guitar'}, {'row': 10, 'column': 9, 'inst': 'guitar'}, {'row': 6, 'column': 11, 'inst': 'guitar'}, {'row': 13, 'column': 11, 'inst': 'guitar'}, {'row': 5, 'column': 12, 'inst': 'guitar'}, {'row': 12, 'column': 12, 'inst': 'guitar'}, {'row': 0, 'column': 16, 'inst': 'guitar'}, {'row': 7, 'column': 16, 'inst': 'guitar'}, {'row': 3, 'column': 18, 'inst': 'guitar'}, {'row': 10, 'column': 18, 'inst': 'guitar'}, {'row': 5, 'column': 20, 'inst': 'guitar'}, {'row': 12, 'column': 20, 'inst': 'guitar'}, {'row': 3, 'column': 23, 'inst': 'guitar'}, {'row': 10, 'column': 23, 'inst': 'guitar'}, {'row': 0, 'column': 25, 'inst': 'guitar'}, {'row': 7, 'column': 25, 'inst': 'guitar'}]
    this.arrBass = [{'row': 0, 'column': 0, 'inst': 'bass'}, {'row': 0, 'column': 2, 'inst': 'bass'}, {'row': 0, 'column': 4, 'inst': 'bass'}, {'row': 0, 'column': 6, 'inst': 'bass'}, {'row': 0, 'column': 8, 'inst': 'bass'}, {'row': 0, 'column': 10, 'inst': 'bass'}, {'row': 0, 'column': 12, 'inst': 'bass'}, {'row': 0, 'column': 14, 'inst': 'bass'}, {'row': 0, 'column': 16, 'inst': 'bass'}, {'row': 0, 'column': 18, 'inst': 'bass'}, {'row': 0, 'column': 20, 'inst': 'bass'}, {'row': 0, 'column': 22, 'inst': 'bass'}, {'row': 0, 'column': 24, 'inst': 'bass'}, {'row': 0, 'column': 26, 'inst': 'bass'}, {'row': 0, 'column': 28, 'inst': 'bass'}, {'row': 0, 'column': 30, 'inst': 'bass'}]
    this.arrMatrix = this.arrGuitar.concat(this.arrBass)

    this.onTogglePlay = this.onTogglePlay.bind(this)
    this.onSelectInstrument = this.onSelectInstrument.bind(this)
  }

  componentDidMount () {
    bass = instruments.getBass()
    guitar = instruments.getGuitar()
    synth = instruments.getSynth()

    this.initTone()
    this.initNexus()
    this.initTransport()
  }

  throttle (type, name) {
    let isPaused = false
    const func = function () {
      if (isPaused) { return }
      isPaused = true
      requestAnimationFrame(function () {
        window.dispatchEvent(new CustomEvent(name))
        isPaused = false
      })
    }
    window.addEventListener(type, func)
  }

  initTone () {
    Tone.Transport.bpm.value = 240
    Tone.Transport.loopEnd = `${measures}m`
    Tone.Transport.loop = true
    Tone.Transport.start(4)
  }

  initNexus () {
    sequencer = new window.Nexus.Sequencer('#sequencer', {
      'size': [window.innerWidth, 300],
      'mode': 'toggle',
      'rows': 14,
      'columns': measures * beatsPerMeasure
    })
    this.renderMatrix()

    sequencer.on('change', (obj) => {
      this.updateSynth(obj)
    })

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      sequencer.resize(window.innerWidth, 300)
      // console.warn(JSON.stringify(sequencer.matrix.pattern))
      // sequencer.matrix.set.all(this.matrix)

      this.renderMatrix()
    })
  }

  renderMatrix () {
    sequencer.resize(window.innerWidth, 300)
    this.arrMatrix.forEach((i) => {
      console.log(i.inst, this.state.inst)
      if (i.inst === this.state.inst) sequencer.matrix.set.cell(i.column, i.row, 1)
    })
  }

  initTransport () {
    Tone.Transport.scheduleRepeat((time) => {
      this.arrMatrix.forEach((i) => {
        let tone = instruments.getNoteFromMatrix(i)
        // console.log(i, tone)
        Tone.Transport.scheduleOnce(() => {
          // synth.triggerAttackRelease(tone.note, `${measures * beatsPerMeasure}n`)
          // const inst = {} // JSON.parse(tone.inst)
          // const inst = eval(tone.inst)

          switch (tone.inst) {
            case 'guitar':
              guitar.triggerAttackRelease(tone.note, `${measures * beatsPerMeasure}n`)
              // sequencer.colorize('accent', '#f00')
              break
            case 'bass':
              bass.triggerAttackRelease(tone.note, `${measures * beatsPerMeasure}n`)
              // sequencer.colorize('accent', '#0f0')
              break
            default:
              synth.triggerAttackRelease(tone.note, `${measures * beatsPerMeasure}n`)
              // sequencer.colorize('accent', '#00f')
              break
          }

          // console.log(inst, tone.note, `${measures * beatsPerMeasure}n`)
          // if (typeof inst === 'object') inst.triggerAttackRelease(tone.note, `${measures * beatsPerMeasure}n`)
        }, tone.time)
      })
    }, `${measures}m`)

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        // console.log('Draw', time)
        sequencer.next()
      }, time)
    }, `${beatsPerMeasure}n`)
  }

  updateSynth (obj) {
    const state = obj.state
    delete obj.state
    obj['inst'] = this.state.inst

    if (state) {
      if (_.find(this.arrMatrix, obj) === undefined) {
        this.arrMatrix.push(obj)
      }
    } else {
      let arrMatrix = this.arrMatrix
      this.arrMatrix = arrMatrix.filter((i) => {
        // console.warn(i, obj, JSON.stringify(i) !== JSON.stringify(obj))
        return JSON.stringify(i) !== JSON.stringify(obj)
      })
    }
    // console.log('arrMatrix', this.arrMatrix, JSON.stringify(this.arrMatrix))

    /* if (state) {
      Tone.Transport.scheduleOnce(() => {
        synth.triggerAttackRelease(note, '8n')
      }, time)
    } else {
      Tone.Transport.scheduleOnce(() => {
        synth.triggerAttackRelease('C0', '8n')
      }, time)
    } */
  }

  onTogglePlay () {
    if (this.state.paused) {
      this.setState({ paused: false })
      Tone.Transport.start()
    } else {
      this.setState({ paused: true })
      Tone.Transport.pause()
    }
  }

  onSelectInstrument (event) {
    console.warn(this.state.inst, event.currentTarget.value)
    this.setState({ inst: event.currentTarget.value })
    setTimeout(() => {
      this.renderMatrix()
    }, 10)
  }

  render () {
    let icon = null
    if (this.state.paused) {
      icon = <PauseIcon />
    } else {
      icon = <PlayIcon />
    }

    return (
      <section>
        <div className='controls'>
          <Button fab color='primary' onClick={this.onTogglePlay}>
            {icon}
          </Button>

          <Radio
            checked={this.state.inst === 'guitar'}
            onChange={this.onSelectInstrument}
            value='guitar'
            name='instrument'
          />
          <Radio
            checked={this.state.inst === 'bass'}
            onChange={this.onSelectInstrument}
            value='bass'
            name='instrument'
          />
          <Radio
            checked={this.state.inst === 'synth'}
            onChange={this.onSelectInstrument}
            value='synth'
            name='instrument'
          />
        </div>

        <div id='sequencer' />
      </section>
    )
  }
}

export default Sequencer
