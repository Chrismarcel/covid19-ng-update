import express from 'express'
import { subscribeToAlerts, unsubscribeFromAlerts, updateStats } from '../controllers'

const router = express.Router()

router.post('/update', updateStats)
router.post('/subscribe', subscribeToAlerts)
router.post('/unsubscribe', unsubscribeFromAlerts)

export default router
