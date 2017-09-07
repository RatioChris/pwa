import { connect } from 'react-redux'
import {
  setBpm,
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
