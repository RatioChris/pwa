import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import logo from '../../images/logo.png'
import './styles.css'

function SimpleAppBar (props) {
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography type='title' color='inherit' className='title'>
          PWA
        </Typography>
        <img src={logo} alt='' className='logo' />
      </Toolbar>
    </AppBar>
  )
}

export default SimpleAppBar
