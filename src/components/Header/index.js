import React, { Component } from 'react'
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

    this.onToggleDrawer = this.onToggleDrawer.bind(this)
  }

  onToggleDrawer () {
    const drawer = this.props.ui.drawer
    this.props.onToggleDrawer(!drawer)
  }

  render () {
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

          <img src={logo} alt='' className='header--logo' />
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header
