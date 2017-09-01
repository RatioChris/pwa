import {
  INSTRUMENT,
  PAUSED,
  SESSION_KEY
} from '../actions'

const session = (state = {
  instrument: 'guitar',
  paused: true,
  key: null
}, action) => {
  switch (action.type) {
    case INSTRUMENT:
      return Object.assign({}, state, { instrument: action.val })
    case PAUSED:
      return Object.assign({}, state, { paused: action.bool })
    case SESSION_KEY:
      return Object.assign({}, state, { key: action.val })
    default:
      return state
  }
}

export default session
