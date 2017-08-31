import {
  DRAWER
} from '../actions'

const ui = (state = {
  drawer: false
}, action) => {
  switch (action.type) {
    case DRAWER:
      return Object.assign({}, state, { drawer: action.bool })
    default:
      return state
  }
}

export default ui
