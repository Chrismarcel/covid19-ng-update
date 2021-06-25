import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/analytics'

const firebaseInit = firebase.initializeApp({
  apiKey: "AIzaSyB_W2xCtpsurZt2boSmdlPNzRf81Do21tI",
  projectId: "covid19updates-95342",
  messagingSenderId: "1056912261039",
  appId: "1:1056912261039:web:1cbecdeebc5f643d54395a"
})

export const FIREBASE_VAPID_KEY = 'BC3mXezEfA6tfalai7D3nKl98i6iiWBS1fWchketvSPcfd5DJ_rJxuxm9PsAfrI-jjyJd-RdumUKKr0G-InetlU'

export default firebaseInit
