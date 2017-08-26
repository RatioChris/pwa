import React, { Component } from 'react'
import Tone from 'tone'
import _ from 'underscore'
import './styles.css'
import firebase from '../../utils/firebase.js'
import Instruments from '../../utils/Instruments'

import { deepOrange, pink, purple } from 'material-ui/colors'
import Button from 'material-ui/Button'
import PlayIcon from 'material-ui-icons/PlayArrow'
import PauseIcon from 'material-ui-icons/Pause'
import Radio from 'material-ui/Radio'

const color1 = deepOrange[500]
const color2 = purple[400]
const color3 = pink[500]

let sequencer
let measures = 8
let beatsPerMeasure = 4
let instruments = new Instruments(measures, beatsPerMeasure)
let bass = null
let guitar = null
let synth = null
let kick = null
let snare = null
let highHat = null
let highHatOpen = null

class Sequencer extends Component {
  constructor (props) {
    super(props)

    this.arrGuitar = [{'row': 0, 'column': 0, 'inst': 'guitar'}, {'row': 7, 'column': 0, 'inst': 'guitar'}, {'row': 3, 'column': 2, 'inst': 'guitar'}, {'row': 10, 'column': 2, 'inst': 'guitar'}, {'row': 5, 'column': 4, 'inst': 'guitar'}, {'row': 12, 'column': 4, 'inst': 'guitar'}, {'row': 0, 'column': 7, 'inst': 'guitar'}, {'row': 7, 'column': 7, 'inst': 'guitar'}, {'row': 3, 'column': 9, 'inst': 'guitar'}, {'row': 10, 'column': 9, 'inst': 'guitar'}, {'row': 6, 'column': 11, 'inst': 'guitar'}, {'row': 13, 'column': 11, 'inst': 'guitar'}, {'row': 5, 'column': 12, 'inst': 'guitar'}, {'row': 12, 'column': 12, 'inst': 'guitar'}, {'row': 0, 'column': 16, 'inst': 'guitar'}, {'row': 7, 'column': 16, 'inst': 'guitar'}, {'row': 3, 'column': 18, 'inst': 'guitar'}, {'row': 10, 'column': 18, 'inst': 'guitar'}, {'row': 5, 'column': 20, 'inst': 'guitar'}, {'row': 12, 'column': 20, 'inst': 'guitar'}, {'row': 3, 'column': 23, 'inst': 'guitar'}, {'row': 10, 'column': 23, 'inst': 'guitar'}, {'row': 0, 'column': 25, 'inst': 'guitar'}, {'row': 7, 'column': 25, 'inst': 'guitar'}]
    this.arrBass = [{'row': 0, 'column': 0, 'inst': 'bass'}, {'row': 0, 'column': 2, 'inst': 'bass'}, {'row': 0, 'column': 4, 'inst': 'bass'}, {'row': 0, 'column': 6, 'inst': 'bass'}, {'row': 0, 'column': 8, 'inst': 'bass'}, {'row': 0, 'column': 10, 'inst': 'bass'}, {'row': 0, 'column': 12, 'inst': 'bass'}, {'row': 0, 'column': 14, 'inst': 'bass'}, {'row': 0, 'column': 16, 'inst': 'bass'}, {'row': 0, 'column': 18, 'inst': 'bass'}, {'row': 0, 'column': 20, 'inst': 'bass'}, {'row': 0, 'column': 22, 'inst': 'bass'}, {'row': 0, 'column': 24, 'inst': 'bass'}, {'row': 0, 'column': 26, 'inst': 'bass'}, {'row': 0, 'column': 28, 'inst': 'bass'}, {'row': 0, 'column': 30, 'inst': 'bass'}]
    this.data = this.arrGuitar.concat(this.arrBass)

    this.state = {
      data: [],
      instrument: 'guitar',
      paused: true
    }

    this.onTogglePlay = this.onTogglePlay.bind(this)
    this.onSelectInstrument = this.onSelectInstrument.bind(this)
  }

  componentDidMount () {
    bass = instruments.getBass()
    guitar = instruments.getGuitar()
    synth = instruments.getSynth()
    kick = instruments.getKick()
    snare = instruments.getSnare()
    highHat = instruments.getHighHat()
    highHatOpen = instruments.getHighHatOpen()

    this.initTone()
    this.initNexus()
    this.initData()
    this.initTransport()

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      // console.warn(JSON.stringify(sequencer.matrix.pattern))
      // sequencer.matrix.set.all(this.matrix)
      this.renderMatrix()
    })
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
    // Tone.Transport.start(4)
  }

  initNexus () {
    if (sequencer) sequencer.destroy()
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
  }

  initData () {
    const sessionRef = firebase.database().ref('sessions')

    sessionRef.on('value', (snapshot) => {
      const items = snapshot.val()
      let sessionData = []
      for (let item in items) {
        console.log(item, items)
        sessionData.push({
          id: item,
          data: items[item].data
        })
      }
      this.data = sessionData[0].data
      this.setState({ data: sessionData })
      this.renderMatrix()
    })
  }

  initTransport () {
    Tone.Transport.scheduleRepeat((time) => {
      this.data.forEach((i) => {
        let tone = instruments.getNoteFromMatrix(i)
        // console.log(i, tone)
        Tone.Transport.scheduleOnce(() => {
          this.triggerInstrument(i, tone.note)
        }, tone.time)
      })
    }, `${measures}m`)

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        sequencer.next()
      }, time)
    }, `${beatsPerMeasure}n`)
  }

  renderMatrix () {
    let instrument = this.state.instrument

    switch (instrument) {
      case 'guitar':
        sequencer.colorize('accent', color1)
        break
      case 'bass':
        sequencer.colorize('accent', color2)
        break
      default:
        sequencer.colorize('accent', color3)
        break
    }

    sequencer.resize(window.innerWidth, 300)
    // sequencer.matrix.populate.all(0)
    // sequencer.matrix.set.all(this.matrix)

    this.data.forEach((i) => {
      if (i.inst === instrument) sequencer.matrix.set.cell(i.column, i.row, 1)
    })
  }

  updateSynth (i) {
    console.log(JSON.stringify(i))
    const state = i.state
    delete i.state
    i['inst'] = this.state.instrument

    if (state) {
      if (_.find(this.data, i) === undefined) {
        // sequencer.matrix.set.cell(i.column, i.row, 1)
        this.data.push(i)
        let tone = instruments.getNoteFromMatrix(i)
        this.triggerInstrument(i, tone.note)

        // const itemsRef = firebase.database().ref('sessions')
        // itemsRef.push(i)
      }
    } else {
      const data = this.data
      const sortObj = {}
      Object.keys(i).sort().forEach((key) => { sortObj[key] = i[key] })

      this.data = data.filter((obj) => {
        let match = obj.row === i.row && obj.column === i.column && obj.inst === i.inst
        console.warn(obj, i, match)
        return !match
      })

      // const itemRef = firebase.database().ref(`/sessions/${itemId}`)
      // itemRef.remove()
    }
    console.log('updateSynth', JSON.stringify(this.data))
  }

  triggerInstrument (i, note) {
    const time = `${measures * beatsPerMeasure}n`

    switch (i.inst) {
      case 'guitar':
        guitar.triggerAttackRelease(note, time)
        break
      case 'bass':
        bass.triggerAttackRelease(note, time)
        break
      case 'drums':
        if (i.row === 0) kick.triggerAttackRelease(0, time)
        if (i.row === 1) snare.triggerAttackRelease(0, time)
        if (i.row === 2) highHat.triggerAttackRelease(0, time)
        if (i.row === 3) highHatOpen.triggerAttackRelease(0, time)
        break
      default:
        synth.triggerAttackRelease(0, time)
        break
    }
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
    this.setState({ instrument: event.currentTarget.value })

    setTimeout(() => {
      this.initNexus()
    }, 0)
  }

  render () {
    let icon = null
    if (this.state.paused) {
      icon = <PlayIcon />
    } else {
      icon = <PauseIcon />
    }

    return (
      <section>
        <div className='controls'>
          <Button fab color='primary' onClick={this.onTogglePlay}>
            {icon}
          </Button>

          <Radio
            checked={this.state.instrument === 'guitar'}
            onChange={this.onSelectInstrument}
            value='guitar'
            name='instrument'
          />
          <Radio
            checked={this.state.instrument === 'bass'}
            onChange={this.onSelectInstrument}
            value='bass'
            name='instrument'
          />
          <Radio
            checked={this.state.instrument === 'drums'}
            onChange={this.onSelectInstrument}
            value='drums'
            name='instrument'
          />
        </div>

        <div id='sequencer' />
      </section>
    )
  }
}

export default Sequencer
