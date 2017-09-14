import React, { Component } from 'react'
import Tone from 'tone'
import firebase from '../../utils/firebase.js'
import { find } from 'underscore'
import Instruments from '../../utils/Instruments'
import './styles.css'

import { deepOrange, green, purple } from 'material-ui/colors'

const color1 = deepOrange[500]
const color1_lite = deepOrange[50]
const color2 = purple[400]
const color2_lite = purple[50]
const color3 = green[500]
const color3_lite = green[50]

let measures = 2
let beatsPerMeasure = 16
let scaleLength = 16
let sequencer
let instruments = new Instruments(measures, beatsPerMeasure)
let bass = null
let guitar = null
let kick = null
let snare = null
let highHat = null
let highHatOpen = null
let cowbell = null

class Sequencer extends Component {
  constructor (props) {
    super(props)

    this.key = this.props.session.key || null
    this.data = {}
    this.dataRef = {}
  }

  componentDidMount () {
    bass = instruments.getBass()
    guitar = instruments.getGuitar()
    kick = instruments.getKick()
    snare = instruments.getSnare()
    highHat = instruments.getHighHat()
    highHatOpen = instruments.getHighHatOpen()
    cowbell = instruments.getCowbell()

    this.init()

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      this.renderMatrix()
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.session.bpm !== nextProps.session.bpm) {
      this.onSetBpm(nextProps.session.bpm)
    }

    if (this.props.session.key !== nextProps.session.key) {
      this.key = nextProps.session.key
      this.setData()
      this.renderMatrix()
    }

    if (this.props.session.locked !== nextProps.session.locked) {
      this.onSetLocked(nextProps.session.locked)
    }

    if (this.props.session.paused !== nextProps.session.paused) {
      this.onPlayPause(nextProps.session.paused)
    }

    if (this.props.session.instrument !== nextProps.session.instrument) {
      this.onSetInstrument()
    }
  }

  init () {
    this.initTone()
    this.setData()
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
    Tone.Transport.loopEnd = `${measures}m`
    Tone.Transport.loop = true
  }

  setData () {
    this.dataRef = firebase.database().ref(`sessions/${this.key}/data`)
    this.dataRef.on('value', (snapshot) => {
      const items = snapshot.val()
      this.data = items || {}
      this.renderMatrix()
    })

    firebase.database().ref(`sessions/${this.key}/meta/bpm`)
      .on('value', (snapshot) => {
        const bpm = snapshot.val() || this.props.session.bpm
        this.onSetBpm(bpm)
      })

    firebase.database().ref(`sessions/${this.key}/meta/locked`)
      .on('value', (snapshot) => {
        const locked = snapshot.val()
        this.onSetLocked(locked)
      })
  }

  initNexus () {
    const instrument = this.props.session.instrument
    let step = 0

    if (sequencer) {
      step = sequencer.stepper.value
      sequencer.destroy()
    }

    sequencer = new window.Nexus.Sequencer('#sequencer', {
      'size': [window.innerWidth, window.innerHeight - 170],
      'mode': 'toggle',
      'rows': instrument === 'drums' ? 5 : scaleLength,
      'columns': measures * beatsPerMeasure
    })

    this.renderMatrix()
    sequencer.stepper.value = step

    sequencer.on('change', (obj) => {
      this.updateSynth(obj)
    })
  }

  initTransport () {
    Tone.Transport.scheduleRepeat((time) => {
      for (var key in this.data) {
        let i = this.data[key]
        const note = instruments.getNoteFromMatrix(i)
        Tone.Transport.scheduleOnce(() => {
          this.triggerInstrument(i, note.tone)
        }, note.time)
      }
    }, `${measures}m`)

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        sequencer.next()
      }, time)
    }, `${beatsPerMeasure}n`)
  }

  renderMatrix () {
    const instrument = this.props.session.instrument

    switch (instrument) {
      case 'guitar':
        sequencer.colorize('fill', color1_lite)
        sequencer.colorize('accent', color1)
        break
      case 'bass':
        sequencer.colorize('fill', color2_lite)
        sequencer.colorize('accent', color2)
        break
      default:
        sequencer.colorize('fill', color3_lite)
        sequencer.colorize('accent', color3)
        break
    }

    sequencer.resize(window.innerWidth, window.innerHeight - 170)

    // console.warn(this.data)
    for (var key in this.data) {
      let i = this.data[key]
      if (i.inst === instrument) sequencer.matrix.set.cell(i.column, i.row, 1)
    }
  }

  updateSynth (i) {
    // console.log(JSON.stringify(i))
    const state = i.state
    delete i.state
    i['inst'] = this.props.session.instrument

    if (state) {
      if (find(this.data, i) === undefined) {
        if (!this.key) {
          const sessionsRef = firebase.database().ref(`sessions`)
          const sessionRef = sessionsRef.push({data: ''})
          this.key = sessionRef.key
          this.dataRef = firebase.database().ref(`sessions/${this.key}/data`)
          this.props.onSetSessionKey(this.key)
        }

        const noteRef = this.dataRef.push(i)
        const key = noteRef.key
        this.data[key] = i

        const note = instruments.getNoteFromMatrix(i)
        this.triggerInstrument(i, note.tone)
      }
    } else {
      const data = this.data

      for (var key in data) {
        let item = data[key]
        console.log(item)
        if (item.row === i.row && item.column === i.column && item.inst === i.inst) {
          console.warn(key, item)

          this.dataRef.child(key).remove()
          delete this.data[key]
          break
        }
      }
    }
    // console.log('updateSynth', JSON.stringify(this.data))
  }

  triggerInstrument (i, note) {
    const instrument = this.props.session.instrument
    const solo = this.props.session.solo
    if (solo && instrument !== i.inst) return

    const time = `${beatsPerMeasure}n`

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
        if (i.row === 4) cowbell.triggerAttackRelease(0, time)
        break
      default:
        break
    }
  }

  onPlayPause (paused) {
    if (paused) {
      Tone.Transport.pause()
    } else {
      Tone.Transport.start()
    }
  }

  onSetBpm (val) {
    this.props.onSetBpm(val)
    // Tone.Transport.bpm.value = val
    Tone.Transport.bpm.rampTo(val, 1)

    if (!this.key) return
    const metaRef = firebase.database().ref(`sessions/${this.key}/meta/bpm`)
    metaRef.set(val)
  }

  onSetLocked (bool) {
    this.props.onSetLocked(bool)

    if (!this.key) return
    const metaRef = firebase.database().ref(`sessions/${this.key}/meta/locked`)
    metaRef.set(bool)
  }

  onSetInstrument () {
    setTimeout(() => {
      this.initNexus()
    }, 0)
  }

  render () {
    const locked = this.props.session.locked

    return (
      <div
        id='sequencer'
        className={`${locked ? 'locked' : 'unlocked'}`}
      />
    )
  }
}

export default Sequencer
