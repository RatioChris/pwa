/* global localStorage */

import React, { Component } from 'react'
import firebase from '../../utils/firebase.js'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import VolumeMute from 'material-ui-icons/VolumeMute'
import VolumeUp from 'material-ui-icons/VolumeUp'
import './styles.css'

class Menu extends Component {
  constructor (props) {
    super(props)

    this.sessionRef = {}
    this.sessions = []

    this.onSetSessionKey = this.onSetSessionKey.bind(this)
    this.onToggleDrawer = this.onToggleDrawer.bind(this)
  }

  componentDidMount () {
    this.initData()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.session.key !== nextProps.session.key) {
      this.key = nextProps.session.key
    }
  }

  initData () {
    this.sessionRef = firebase.database().ref(`sessions`)

    this.sessionRef.on('value', (snapshot) => {
      const items = snapshot.val()
      this.sessions = []
      for (var key in items) {
        this.sessions.push(key)
      }
    })
  }

  onSetSessionKey (e) {
    const key = e.textContent
    this.props.onSetSessionKey(key)
    localStorage.setItem('sessionKey', key)
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
          onClick={this.onToggleDrawer}
        >
          <div className='drawer--button'>
            <IconButton onClick={this.onToggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />

          <List>
            {this.sessions.map((item, index) => {
              let icon = null
              if (item === this.props.session.key) {
                icon = <VolumeUp />
              } else {
                icon = <VolumeMute />
              }

              return (
                <ListItem button
                  key={`menu--${index}`}
                  onClick={(e) => this.onSetSessionKey(e.target)}
                >
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>

                  <ListItemText inset
                    primary={item}
                  />
                </ListItem>
              )
            }, this)}
          </List>
        </Drawer>
      </div>
    )
  }
}

export default Menu
