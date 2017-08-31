import { connect } from 'react-redux'
import {
  setDrawer
} from '../actions'
import Header from '../components/Header'

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

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer
