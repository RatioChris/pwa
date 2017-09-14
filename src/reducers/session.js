/* global localStorage */

import {
  BPM,
  INSTRUMENT,
  LOCKED,
  PAUSED,
  SESSION_KEY,
  SOLO
} from '../actions'

const session = (state = {
  bpm: 60,
  instrument: localStorage.getItem('instrument') || 'guitar',
  key: localStorage.getItem('sessionKey') || null,
  locked: false,
  paused: true,
  solo: false
}, action) => {
  switch (action.type) {
    case BPM:
      return Object.assign({}, state, { bpm: action.num })
    case INSTRUMENT:
      return Object.assign({}, state, { instrument: action.val })
    case LOCKED:
      return Object.assign({}, state, { locked: action.bool })
    case PAUSED:
      return Object.assign({}, state, { paused: action.bool })
    case SESSION_KEY:
      return Object.assign({}, state, { key: action.val })
    case SOLO:
      return Object.assign({}, state, { solo: action.bool })
    default:
      return state
  }
}

export default session
