import {
  INSTRUMENT,
  PAUSED
} from '../actions'

const player = (state = {
  instrument: 'guitar',
  paused: true
}, action) => {
  switch (action.type) {
    case INSTRUMENT:
      return Object.assign({}, state, { instrument: action.val })
    case PAUSED:
      return Object.assign({}, state, { paused: action.bool })
    default:
      return state
  }
}

export default player
