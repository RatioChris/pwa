import { combineReducers } from 'redux'
import player from './player'
import ui from './ui'

const rootReducer = combineReducers({
  player,
  ui
})

export default rootReducer
