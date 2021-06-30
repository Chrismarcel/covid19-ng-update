import express from 'express'
import { sendSSRPage, subscribeToAlerts, unsubscribeFromAlerts, updateStats } from '../controllers'

const router = express.Router()

router.get('/', sendSSRPage)
router.post('/update', updateStats)
router.post('/subscribe', subscribeToAlerts)
router.post('/unsubscribe', unsubscribeFromAlerts)

export default router
