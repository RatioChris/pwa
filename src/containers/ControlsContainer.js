import { connect } from 'react-redux'
import {
  setBpm,
  setInstrument,
  setPaused,
  setSolo
} from '../actions'
import Controls from '../components/Controls'

const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPlayPause: (bool) => {
      dispatch(setPaused(bool))
    },
    onSetBpm: (num) => {
      dispatch(setBpm(num))
    },
    onSetInstrument: (val) => {
      dispatch(setInstrument(val))
    },
    onSetSolo: (bool) => {
      dispatch(setSolo(bool))
    }
  }
}

const ControlsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Controls)

export default ControlsContainer
