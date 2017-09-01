import { combineReducers } from 'redux'
import session from './session'
import ui from './ui'

const rootReducer = combineReducers({
  session,
  ui
})

export default rootReducer
