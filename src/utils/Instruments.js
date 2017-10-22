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

  getNoteFromMatrix (obj) {
    return {
      time: beats[obj.column],
      tone: notes[obj.row]
    }
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
  getKick () {
    return kick()
  }
  getSnare () {
    return snare()
  }
  getHighHat () {
    return highHat()
  }
  getHighHatOpen () {
    return highHatOpen()
  }
  getCowbell () {
    return cowbell()
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
    beats.push(`${bar}:0:${beat}`)
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
/* const autoFilter = new Tone.AutoFilter({
  frequency: '1',
  wet: 1,
  depth: 0.75
}) */

const autoWah = new Tone.AutoWah({
  baseFrequency: 360,
  octaves: 0,
  Q: 0,
  gain: 10
})

// const chorus = new Tone.Chorus()

/* const convolver = new Tone.Convolver({
  url: './samples/ir.wav'
}) */

const delay = new Tone.PingPongDelay({
  delayTime: 0.25,
  feedback: 0.4,
  wet: 0.07
})

/* const distortion = new Tone.Distortion({
  distortion: 5,
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
}) */

const reverb = new Tone.Freeverb({
  roomSize: 0.8,
  dampening: 6000
})

/* const portamento = new Tone.Monophonic({
  portamento: 0.25
}) */

const lowPass = new Tone.Filter({
  frequency: 14000
}).toMaster()

/**
 * Synth
 */
const synth = () => {
  let instrument = new Tone.PolySynth(6, Tone.MonoSynth).chain(lowPass)
  instrument.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.1,
      release: 2
    }
  })

  return instrument
}

/**
 * Guitar
 */
const guitar = () => {
  let instrument = new Tone.PolySynth(6, Tone.MonoSynth).chain(delay, reverb, lowPass)
  instrument.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.01,
      release: 3
    },
    filterEnvelope: {
      attack: 0.06,
      decay: 0.2,
      sustain: 0.5,
      release: 2,
      baseFrequency: 200,
      octaves: 7,
      exponent: 2
    },
    volume: -4
  })

  return instrument
}

/**
 * Bass
 */
const bass = () => {
  let instrument = new Tone.PolySynth(6, Tone.MonoSynth).chain(autoWah, lowPass)
  instrument.set({
    oscillator: {
      type: 'square'
    },
    envelope: {
      attack: 0.01,
      decay: 0.01,
      sustain: 3,
      release: 3
    }
  })

  return instrument
}

/**
 * Drums
 */
const kick = () => {
  return new Tone.Sampler({
    url: './samples/kick.mp3',
    volume: 20
  }).toMaster()
}

const snare = () => {
  return new Tone.Sampler({
    url: './samples/snare.mp3',
    volume: 15
  }).toMaster()
}

const highHat = () => {
  return new Tone.Sampler({
    url: './samples/highHat.mp3'
  }).toMaster()
}

const highHatOpen = () => {
  return new Tone.Sampler({
    url: './samples/highHatOpen.mp3',
    envelope: {
      release: 2
    }
  }).toMaster()
}

const cowbell = () => {
  return new Tone.Sampler({
    url: './samples/cowbell.mp3'
  }).toMaster()
}
