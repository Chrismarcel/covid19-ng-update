import admin from 'firebase-admin'

const isDevEnv = process.env.ENV === 'DEV'
const privateKey = process.env.FIREBASE_PRIVATE_KEY

const FIREBASE_CONFIG = {
  type: process.env.FIREBASE_ACCOUNT_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  // Having issues where firebase keeps failing on Prod, issue being it can't parse the Private Key
  // Locally though, this doesn't seem to be a problem
  // This link helped - https://stackoverflow.com/a/41044630
  private_key: isDevEnv ? privateKey : privateKey.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
}

export const FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY

const firebaseInstance = admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: process.env.FIREBASE_DB_URL,
})

export default firebaseInstance
