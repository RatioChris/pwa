import { connect } from 'react-redux'
import {
  setInstrument,
  setPaused
} from '../actions'
import Controls from '../components/Controls'

const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetInstrument: (val) => {
      dispatch(setInstrument(val))
    },
    onPlayPause: (bool) => {
      dispatch(setPaused(bool))
    }
  }
}

const ControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls)

export default ControlsContainer
