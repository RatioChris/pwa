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

class Sequencer extends Component {
  constructor (props) {
    super(props)

    this.key = null
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

    this.init()

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      this.renderMatrix()
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.session.key !== nextProps.session.key) {
      this.key = nextProps.session.key
      this.initData()
      this.renderMatrix()
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
    this.initData()
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
    Tone.Transport.bpm.value = 60
    Tone.Transport.loopEnd = `${measures}m`
    Tone.Transport.loop = true
    // Tone.Transport.start(4)
  }

  initData () {
    this.dataRef = firebase.database().ref(`sessions/${this.key}/data`)

    // let x = firebase.database().ref(`sessions`)
    // x.push({data: ''})

    this.dataRef.on('value', (snapshot) => {
      const items = snapshot.val()
      console.warn('initData', items)
      this.data = items || {}
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
      'rows': instrument === 'drums' ? 4 : scaleLength,
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
      /* this.data.forEach((i) => {
        const note = instruments.getNoteFromMatrix(i)
        Tone.Transport.scheduleOnce(() => {
          this.triggerInstrument(i, note.tone)
        }, note.time)
      }) */
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
    /* this.data.forEach((i) => {
      if (i.inst === instrument) sequencer.matrix.set.cell(i.column, i.row, 1)
    }) */
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
        const noteRef = this.dataRef.push(i)
        const key = noteRef.key

        // i['key'] = key
        // this.data.push(i)
        // this.data.push({ [key]: i })
        this.data[key] = i

        const note = instruments.getNoteFromMatrix(i)
        this.triggerInstrument(i, note.tone)
      }
    } else {
      const data = this.data

      /* this.data = data.filter((obj) => {
        let match = obj.row === i.row && obj.column === i.column && obj.inst === i.inst
        return !match
      }) */

      /* const x = data.find((obj) => {
        let match = obj.row === i.row && obj.column === i.column && obj.inst === i.inst
        return !match
      })
      console.warn(x) */

      for (var key in data) {
        let item = data[key]
        console.log(item)
        if (item.row === i.row && item.column === i.column && item.inst === i.inst) {
          console.warn(key, item)

          this.dataRef.child(key).remove()
          delete this.data[key]
          break
        }

        // let i = this.data[key]
      }
    }
    // console.log('updateSynth', JSON.stringify(this.data))
  }

  triggerInstrument (i, note) {
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

  onSetInstrument () {
    setTimeout(() => {
      this.initNexus()
    }, 0)
  }

  render () {
    return (
      <div id='sequencer' />
    )
  }
}

export default Sequencer
