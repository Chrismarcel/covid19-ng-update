import firebase from 'firebase/app'
import 'firebase/messaging'

const firebaseInit = firebase.initializeApp({
  apiKey: "AIzaSyB_W2xCtpsurZt2boSmdlPNzRf81Do21tI",
  projectId: "covid19updates-95342",
  messagingSenderId: "1056912261039",
  appId: "1:1056912261039:web:1cbecdeebc5f643d54395a"
})

export default firebaseInit
