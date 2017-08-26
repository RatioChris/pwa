import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyBlnkY82-BEoILhYe2AZn0MSFN95w0EpJE',
  authDomain: 'labyrinth-9c848.firebaseapp.com',
  databaseURL: 'https://labyrinth-9c848.firebaseio.com',
  projectId: 'labyrinth-9c848',
  storageBucket: 'labyrinth-9c848.appspot.com',
  messagingSenderId: '421138567276'
}
firebase.initializeApp(config)

export default firebase
