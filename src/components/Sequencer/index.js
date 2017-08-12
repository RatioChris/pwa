import React, { Component } from 'react'
import Tone from 'tone'
import _ from 'underscore'
import './styles.css'
import Instruments from '../../utils/Instruments'

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

    // this.arrMatrix = [{'row': 0, 'column': 0}, {'row': 3, 'column': 2}, {'row': 5, 'column': 4}, {'row': 0, 'column': 7}, {'row': 0, 'column': 16}, {'row': 3, 'column': 18}, {'row': 5, 'column': 20}, {'row': 3, 'column': 9}, {'row': 6, 'column': 11}, {'row': 5, 'column': 12}, {'row': 3, 'column': 23}, {'row': 0, 'column': 25}]
    this.arrMatrix = [{'row': 0, 'column': 0}, {'row': 3, 'column': 2}, {'row': 5, 'column': 4}, {'row': 0, 'column': 7}, {'row': 0, 'column': 16}, {'row': 3, 'column': 18}, {'row': 5, 'column': 20}, {'row': 3, 'column': 9}, {'row': 6, 'column': 11}, {'row': 5, 'column': 12}, {'row': 3, 'column': 23}, {'row': 0, 'column': 25}, {'row': 7, 'column': 0}, {'row': 10, 'column': 2}, {'row': 12, 'column': 4}, {'row': 7, 'column': 7}, {'row': 10, 'column': 9}, {'row': 13, 'column': 11}, {'row': 12, 'column': 12}, {'row': 10, 'column': 18}, {'row': 12, 'column': 20}, {'row': 7, 'column': 16}, {'row': 10, 'column': 23}, {'row': 7, 'column': 25}, {'row': 0, 'column': 2}, {'row': 0, 'column': 4}, {'row': 0, 'column': 6}, {'row': 0, 'column': 18}, {'row': 0, 'column': 20}, {'row': 0, 'column': 8}, {'row': 0, 'column': 10}, {'row': 0, 'column': 12}, {'row': 0, 'column': 14}, {'row': 0, 'column': 30}, {'row': 0, 'column': 28}, {'row': 0, 'column': 26}, {'row': 0, 'column': 24}, {'row': 0, 'column': 22}]
    this.arrGuitar = [{'row': 0, 'column': 0}, {'row': 3, 'column': 2}, {'row': 5, 'column': 4}, {'row': 0, 'column': 7}, {'row': 0, 'column': 16}, {'row': 3, 'column': 18}, {'row': 5, 'column': 20}, {'row': 3, 'column': 9}, {'row': 6, 'column': 11}, {'row': 5, 'column': 12}, {'row': 3, 'column': 23}, {'row': 0, 'column': 25}, {'row': 7, 'column': 0}, {'row': 10, 'column': 2}, {'row': 12, 'column': 4}, {'row': 7, 'column': 7}, {'row': 10, 'column': 9}, {'row': 13, 'column': 11}, {'row': 12, 'column': 12}, {'row': 10, 'column': 18}, {'row': 12, 'column': 20}, {'row': 7, 'column': 16}, {'row': 10, 'column': 23}, {'row': 7, 'column': 25}]
    this.arrBass = [{'row': 0, 'column': 0}, {'row': 0, 'column': 16}, {'row': 0, 'column': 2}, {'row': 0, 'column': 4}, {'row': 0, 'column': 6}, {'row': 0, 'column': 18}, {'row': 0, 'column': 20}, {'row': 0, 'column': 8}, {'row': 0, 'column': 10}, {'row': 0, 'column': 12}, {'row': 0, 'column': 14}, {'row': 0, 'column': 30}, {'row': 0, 'column': 28}, {'row': 0, 'column': 26}, {'row': 0, 'column': 24}, {'row': 0, 'column': 22}]
    this.arrNotes = []
    this.matrix = []
  }

  componentDidMount () {
    this.initTone()
    this.initNexus()
    this.setNotesFromMatrix()
    bass = instruments.getBass()
    guitar = instruments.getGuitar()
    synth = instruments.getGuitar()
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
    Tone.Transport.start(3)

    /* const part = new Tone.Part(function (time, value) {
      synth.triggerAttackRelease(value.note, `${measures * beatsPerMeasure}n`, time)
    }, this.arrNotes)
    part.start(0) */

    Tone.Transport.scheduleRepeat((time) => {
      console.log(`initTone ${measures}m`, time)
      this.arrNotes.forEach((i) => {
        // console.log(i)
        Tone.Transport.scheduleOnce(() => {
          synth.triggerAttackRelease(i.note, `${measures * beatsPerMeasure}n`)
        }, i.time)
      })
    }, `${measures}m`)
  }

  initNexus () {
    sequencer = new window.Nexus.Sequencer('#sequencer', {
      'size': [window.innerWidth, 300],
      'mode': 'toggle',
      'rows': 14,
      'columns': measures * beatsPerMeasure
    })
    this.arrMatrix.forEach((i) => {
      sequencer.matrix.set.cell(i.column, i.row, 1)
    })

    sequencer.on('change', (v) => {
      this.updateSynth(v)
    })

    Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        // console.log('Draw', time)
        sequencer.next()
      }, time)
    }, `${beatsPerMeasure}n`)

    this.throttle('resize', 'optimizedResize')
    window.addEventListener('optimizedResize', () => {
      sequencer.resize(window.innerWidth, 300)
      // console.warn(JSON.stringify(sequencer.matrix.pattern))
      // console.warn(JSON.stringify(this.matrix))
      // sequencer.matrix.set.all(this.matrix)

      this.arrMatrix.forEach((i) => {
        sequencer.matrix.set.cell(i.column, i.row, 1)
      })
    })
  }

  setNotesFromMatrix () {
    this.arrMatrix.forEach((i) => {
      let beat = {
        time: instruments.getTime(i.column),
        note: instruments.getNote(i.row)
      }
      this.arrNotes.push(beat)
    })
  }

  updateSynth (v) {
    console.warn('updateSynth')
    console.log(v)
    const state = v.state
    delete v.state
    this.matrix = sequencer.matrix.pattern

    let beat = {
      time: instruments.getTime(v.column),
      note: instruments.getNote(v.row)
    }

    if (state) {
      if (_.find(this.arrMatrix, v) === undefined) {
        this.arrMatrix.push(v)
        this.arrNotes.push(beat)
      }
    } else {
      let arrMatrix = this.arrMatrix
      let arrNotes = this.arrNotes
      this.arrMatrix = arrMatrix.filter((i) => {
        // console.warn(i, v, JSON.stringify(i) !== JSON.stringify(v))
        return JSON.stringify(i) !== JSON.stringify(v)
      })
      this.arrNotes = arrNotes.filter((i) => {
        // console.warn(i, v, JSON.stringify(i) !== JSON.stringify(beat))
        return JSON.stringify(i) !== JSON.stringify(beat)
      })
    }
    console.log('arrMatrix', this.arrMatrix, JSON.stringify(this.arrMatrix))
    console.log('arrNotes', this.arrNotes, JSON.stringify(this.arrNotes))

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
      console.log(time, note, this.arrNotes[0])
      Tone.Transport.schedule(() => {
        synth.triggerAttackRelease(note, '8n')
      }, time)
    }, [this.arrNotes])
    part.start(0) */
  }

  render () {
    return (
      <div id='sequencer' />
    )
  }
}

export default Sequencer
