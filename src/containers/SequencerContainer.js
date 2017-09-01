import { connect } from 'react-redux'
import Sequencer from '../components/Sequencer'

const mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

const SequencerContainer = connect(
  mapStateToProps
)(Sequencer)

export default SequencerContainer
