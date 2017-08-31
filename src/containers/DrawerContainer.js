import { connect } from 'react-redux'
import {
  setDrawer
} from '../actions'
import Drawer from '../components/Drawer'

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleDrawer: (bool) => {
      dispatch(setDrawer(bool))
    }
  }
}

const DrawerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)

export default DrawerContainer
