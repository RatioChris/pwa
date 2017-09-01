import { connect } from 'react-redux'
import {
  setBpm,
  setSession
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
    onSetSession: (val) => {
      dispatch(setSession(val))
    }
  }
}

const SequencerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sequencer)

export default SequencerContainer
