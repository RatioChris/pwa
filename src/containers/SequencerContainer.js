import { connect } from 'react-redux'
import Sequencer from '../components/Sequencer'

const mapStateToProps = (state) => {
  return {
    player: state.player
  }
}

const SequencerContainer = connect(
  mapStateToProps
)(Sequencer)

export default SequencerContainer
