import Tone from 'tone'

let beats = []
let notes = [
  'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3',
  'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4',
  'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5'
]

export default class Instruments {
  constructor (measures, beatsPerMeasure) {
    beats = this.setBeats(measures, beatsPerMeasure)
  }

  setBeats (measures, beatsPerMeasure) {
    return _setBeats(measures, beatsPerMeasure)
  }
  setNotes (qty) {
    return _setNotes(qty)
  }

  getNote (index) {
    return notes[index]
  }
  getTime (index) {
    return beats[index]
  }

  /**
   * Instruments
   */
  getBass () {
    return bass()
  }
  getGuitar () {
    return guitar()
  }
  getSynth () {
    return synth()
  }
}

const _setNotes = (qty) => {
  let arr = []
  for (var i = 0; i < qty; i++) {
    arr.push(notes[i])
  }

  return arr
}

const _setBeats = (measures, beatsPerMeasure) => {
  let bar = 0
  let beat = 0
  for (var i = 0; i < (measures * beatsPerMeasure); i++) {
    beats.push(`${bar}:${beat}`)
    beat++
    if (beat % beatsPerMeasure === 0) {
      beat = 0
      bar++
    }
  }

  return beats
}

/**
 * Effects
 */
const autoFilter = new Tone.AutoFilter({
  frequency: '1',
  wet: 1,
  depth: 0.75
})

const autoWah = new Tone.AutoWah({
  baseFrequency: 120,
  octaves: 1,
  Q: 1,
  gain: 30
})

const chorus = new Tone.Chorus()

const delay = new Tone.PingPongDelay({
  delayTime: 0.25,
  feedback: 0.25,
  wet: 0.1
})

const distortion = new Tone.Distortion({
  distortion: 1,
  oversample: '4x',
  wet: 1
})

const phaser = new Tone.Phaser({
  frequency: 0.5,
  octaves: 3,
  baseFrequency: 3000
})

const pitch = new Tone.PitchShift({
  pitch: 0,
  windowSize: 0.5,
  wet: 1
})

const reverb = new Tone.Freeverb({
  roomSize: 0.8,
  dampening: 6000
})

const portamento = new Tone.Monophonic({
  portamento: 0.25
})

const lowPass = new Tone.Filter({
  frequency: 14000
}).toMaster()

/**
 * Synth
 */
const synth = () => {
  let inst = new Tone.PolySynth(12, Tone.MonoSynth).chain(delay, reverb, lowPass)
  inst.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.1,
      release: 2
    }
  })

  return inst
}

/**
 * Guitar
 */
const guitar = () => {
  let inst = new Tone.PolySynth(12, Tone.MonoSynth).chain(delay, distortion, reverb, lowPass)
  inst.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.1,
      release: 2
    }
  })

  return inst
}

/**
 * Bass
 */
const bass = () => {
  let inst = new Tone.PolySynth(12, Tone.MonoSynth).chain(autoWah, lowPass)
  inst.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0.9,
      release: 2
    }
  })

  return inst
}

/**
 * Hi-hat Open
 */
const openHiHat = new Tone.NoiseSynth({
  'volume': -10,
  'filter': {
    'Q': 1
  },
  'envelope': {
    'attack': 0.01,
    'decay': 0.3
  },
  'filterEnvelope': {
    'attack': 0.01,
    'decay': 0.03,
    'baseFrequency': 4000,
    'octaves': -2.5,
    'exponent': 4
  }
})

/**
 * Hi-hat Closed
 */
const closedHiHat = new Tone.NoiseSynth({
  'volume': -10,
  'filter': {
    'Q': 1
  },
  'envelope': {
    'attack': 0.01,
    'decay': 0.15
  },
  'filterEnvelope': {
    'attack': 0.01,
    'decay': 0.03,
    'baseFrequency': 4000,
    'octaves': -2.5,
    'exponent': 4
  }
})
