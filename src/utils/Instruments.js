import Tone from 'tone'

/**
 * Low Pass Filter
 */
const lowPass = new Tone.Filter({
  'frequency': 14000
}).toMaster()

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
}).connect(lowPass)

const openHiHatPart = new Tone.Part(function (time) {
  openHiHat.triggerAttack(time)
}, ['2*8n', '6*8n'])
// openHiHatPart.start(0)

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
}).connect(lowPass)

const closedHatPart = new Tone.Part(function (time) {
  closedHiHat.triggerAttack(time)
}, ['0*8n', '1*8n', '3*8n', '4*8n', '5*8n', '7*8n', '8*8n'])
// closedHatPart.start(0)
