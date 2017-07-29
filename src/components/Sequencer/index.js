import React, { Component } from 'react'
import Tone from 'tone'
// import styles from './styles.css'
// import Instruments from '../../utils/Instruments'

let sequencer = null
let synth = null

class Sequencer extends Component {
  constructor (props) {
    super(props)

    this.arr = []
    this.arrFixed = []
  }

  componentDidMount () {
    this.initTone()
    this.initNexus()
    this.initSynth()
  }

  throttle (type, name, obj) {
    obj = obj || window
    var running = false
    var func = function () {
      if (running) { return }
      running = true
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name))
        running = false
      })
    }
    obj.addEventListener(type, func)
  }

  initTone () {
    Tone.Transport.bpm.value = 120
    Tone.Transport.loopEnd = '2m'
    Tone.Transport.loop = true
    Tone.Transport.start(1)

    const part = new Tone.Part(function (time, value) {
    // the value is an object which contains both the note and the velocity
      synth.triggerAttackRelease(value.note, '8n', time)
    }, this.arrFixed)
    part.start(0)

    Tone.Transport.scheduleRepeat((time) => {
      console.log('initTone 2m')
      this.arrFixed.forEach((i) => {
        console.log(i)

        Tone.Transport.scheduleOnce(() => {
          synth.triggerAttackRelease(i.note, '8n')
        }, i.time)
      })
    }, '2m')
  }

  initNexus () {
    sequencer = new window.Nexus.Sequencer('#sequencer', {
      'size': [window.innerWidth, 200],
      'mode': 'toggle',
      'rows': 4,
      'columns': 8
    })

    sequencer.on('change', (v) => {
      this.updateSynth(v)
    })

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        // console.log('Draw', time)
        sequencer.next()
      }, time)
    }, '4n')

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      sequencer.resize(window.innerWidth, 200)
    })
  }

  initSynth () {
    synth = new Tone.PolySynth(6, Tone.MonoSynth).toMaster()
    synth.set({
      'oscillator': {
        'type': 'square'
      },
      'envelope': {
        'attack': 0.1
      }
    })
  }

  updateSynth (v) {
    console.log(v)
    const col = v.column
    const row = v.row
    const state = v.state
    delete v.state
    let time
    let note

    // let i = `${v.col}.${v.row}`
    console.warn(state, v)
    if (state) {
      this.arr.push(v)
    } else {
      let arr = this.arr
      console.warn('before', this.arr)
      this.arr = arr.filter((i) => {
        // console.warn(i, v, JSON.stringify(i) !== JSON.stringify(v))
        return JSON.stringify(i) !== JSON.stringify(v)
      })
      console.warn('after', this.arr)
    }
    console.log('arr', this.arr, JSON.stringify(this.arr))

    switch (col) {
      case 0:
        time = '0:0'
        break
      case 1:
        time = '0:1'
        break
      case 2:
        time = '0:2'
        break
      case 3:
        time = '0:3'
        break
      case 4:
        time = '1:0'
        break
      case 5:
        time = '1:1'
        break
      case 6:
        time = '1:2'
        break
      case 7:
        time = '1:3'
        break
      default:
        break
    }

    switch (row) {
      case 0:
        note = 'F#3'
        break
      case 1:
        note = 'E3'
        break
      case 2:
        note = 'D3'
        break
      case 3:
        note = 'C3'
        break
      default:
        break
    }

    let beat = {
      time: time,
      note: note
    }

    if (state) {
      this.arrFixed.push(beat)
    } else {
      let arr = this.arrFixed
      console.warn('before', this.arrFixed)
      this.arrFixed = arr.filter((i) => {
        // console.warn(i, v, JSON.stringify(i) !== JSON.stringify(beat))
        return JSON.stringify(i) !== JSON.stringify(beat)
      })
      console.warn('after', this.arrFixed)
    }

    console.log('arrFixed', this.arrFixed, JSON.stringify(this.arrFixed))

    /* if (state) {
      Tone.Transport.scheduleOnce(() => {
        synth.triggerAttackRelease(note, '8n')
      }, time)
    } else {
      Tone.Transport.scheduleOnce(() => {
        synth.triggerAttackRelease('C0', '8n')
      }, time)
    } */

    /* let part = new Tone.Part((time, note) => {
      // synth.triggerAttackRelease(note, '8n', time)
      console.log(time, note, this.arrFixed[0])
      Tone.Transport.schedule(() => {
        synth.triggerAttackRelease(note, '8n')
      }, time)
    }, [this.arrFixed])
    part.start(0) */
  }

  render () {
    return (
      <div id='sequencer' />
    )
  }
}

export default Sequencer
