import { connect } from 'react-redux'
import {
  setBpm,
  setLocked,
  setSessionKey
} from '../actions'
import Sequencer from '../components/Sequencer'

const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetBpm: (num) => {
      dispatch(setBpm(num))
    },
    onSetLocked: (bool) => {
      dispatch(setLocked(bool))
    },
    onSetSessionKey: (val) => {
      dispatch(setSessionKey(val))
    }
  }
}

const SequencerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sequencer)

export default SequencerContainer
