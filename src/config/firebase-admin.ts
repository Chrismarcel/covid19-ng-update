import admin, { ServiceAccount } from 'firebase-admin'
import dotenv from 'dotenv'

dotenv.config()

export const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY
const FIREBASE_ADMIN_CRED = JSON.parse(process.env.FIREBASE_CREDS as string)

const firebaseInstance = admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_ADMIN_CRED as ServiceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
})

export default firebaseInstance
