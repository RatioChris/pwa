import React, { Component } from 'react'
import firebase from '../../utils/firebase.js'
import classNames from 'classnames'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import logo from '../../images/logo.png'
import './styles.css'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      networkConnection: false
    }

    this.onToggleDrawer = this.onToggleDrawer.bind(this)
  }

  componentDidMount () {
    this.connectionState()
  }

  onToggleDrawer () {
    const drawer = this.props.ui.drawer
    this.props.onToggleDrawer(!drawer)
  }

  connectionState () {
    const connectedRef = firebase.database().ref('.info/connected')
    connectedRef.on('value', (snap) => {
      this.setState({ networkConnection: snap.val() })
    })
  }

  render () {
    const cx = classNames(
      'header--logo',
      { 'disconnected': !this.state.networkConnection }
    )

    return (
      <AppBar position='static' color='primary' className='header'>
        <Toolbar>
          <IconButton
            color='contrast'
            aria-label='open drawer'
            onClick={this.onToggleDrawer}
          >
            <MenuIcon />
          </IconButton>

          <Typography type='title' color='inherit' className='header--title'>
            PWA
          </Typography>

          <img src={logo} alt='' className={cx} />
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header
