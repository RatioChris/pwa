import React, { Component } from 'react'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import VolumeUp from 'material-ui-icons/VolumeUp'
import './styles.css'

class Menu extends Component {
  constructor (props) {
    super(props)

    this.onToggleDrawer = this.onToggleDrawer.bind(this)
  }

  onToggleDrawer () {
    this.props.onToggleDrawer(false)
  }

  render () {
    return (
      <div>
        <Drawer className='drawer'
          type='persistent'
          open={this.props.ui.drawer}
          onRequestClose={this.onToggleDrawer}
          // onClick={this.onToggleDrawer}
        >
          <div className='drawer--button'>
            <IconButton onClick={this.onToggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />

          <List>
            <ListItem button>
              <ListItemIcon>
                <VolumeUp />
              </ListItemIcon>
              <ListItemText inset primary='Current Session' />
            </ListItem>

            <ListItem button>
              <ListItemText inset primary='Other Sessions' />
            </ListItem>

            <ListItem button>
              <ListItemText inset primary='Other Sessions' />
            </ListItem>
          </List>
        </Drawer>
      </div>
    )
  }
}

export default Menu
