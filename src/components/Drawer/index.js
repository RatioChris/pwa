/* global localStorage */

import React, { Component } from 'react'
import firebase from '../../utils/firebase.js'
import Button from 'material-ui/Button'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Lock from 'material-ui-icons/Lock'
import VolumeMute from 'material-ui-icons/VolumeMute'
import VolumeUp from 'material-ui-icons/VolumeUp'
import './styles.css'

class Menu extends Component {
  constructor (props) {
    super(props)

    this.sessionRef = {}
    this.sessions = []

    this.onCreateSession = this.onCreateSession.bind(this)
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
        let locked = (items[key].meta && items[key].meta.locked) || false

        this.sessions.push({
          key: key,
          locked: locked
        })
      }
    })
  }

  onCreateSession () {
    const sessionsRef = firebase.database().ref(`sessions`)
    const sessionRef = sessionsRef.push({data: ''})
    this.onSetSessionKey(sessionRef.key)
  }

  onSetSessionKey (key) {
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
              if (item.key === this.props.session.key) {
                icon = <VolumeUp />
              } else {
                icon = <VolumeMute />
              }

              return (
                <ListItem button
                  key={`menu--${index}`}
                  onClick={(e) => this.onSetSessionKey(e.target.textContent)}
                >
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>

                  <ListItemText inset
                    primary={item.key}
                  />

                  { item.locked &&
                    <ListItemIcon>
                      <Lock />
                    </ListItemIcon>
                  }
                </ListItem>
              )
            }, this)}
          </List>

          <Button raised color='primary' onClick={this.onCreateSession}>
            Create New Session
          </Button>
        </Drawer>
      </div>
    )
  }
}

export default Menu
