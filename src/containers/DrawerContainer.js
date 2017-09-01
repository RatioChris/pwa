import { connect } from 'react-redux'
import {
  setDrawer,
  setSession
} from '../actions'
import Drawer from '../components/Drawer'

const mapStateToProps = (state) => {
  return {
    session: state.session,
    ui: state.ui
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleDrawer: (bool) => {
      dispatch(setDrawer(bool))
    },
    onSetSession: (val) => {
      dispatch(setSession(val))
    }
  }
}

const DrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)

export default DrawerContainer
