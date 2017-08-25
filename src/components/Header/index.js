import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

function SimpleAppBar (props) {
  return (
    <div>
      <AppBar position='static' color='default'>
        <Toolbar>
          <Typography type='title' color='inherit'>
            Title
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default SimpleAppBar
